import { 
    AudioPlayer, 
    AudioPlayerStatus, 
    createAudioPlayer, 
    createAudioResource, 
    joinVoiceChannel, 
    StreamType, 
    VoiceConnection, 
    VoiceConnectionStatus 
} from '@discordjs/voice';
import { GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { spawn } from 'child_process';
import { resolve } from 'path';
import os from 'os';

const { constants: ytdlConstants } = require('youtube-dl-exec');
const YTDLP_PATH = ytdlConstants.YOUTUBE_DL_PATH;

let FFMPEG_PATH = 'ffmpeg';
if (os.platform() !== 'android') {
    try {
        const ffmpegStatic = require('ffmpeg-static');
        if (ffmpegStatic) FFMPEG_PATH = ffmpegStatic;
    } catch (e) {
        // Fallback to system ffmpeg
    }
}

export interface Track {
    url: string;
    title: string;
    author: string;
    requestedBy: string;
}

export class MusicQueue {
    public tracks: Track[] = [];
    public connection: VoiceConnection | null = null;
    public player: AudioPlayer;
    public currentTrack: Track | null = null;
    public lastTrack: Track | null = null;
    public textChannel: TextChannel | null = null;
    public autoplay: boolean = false;
    public loopMode: 0 | 1 | 2 = 0; // 0: Off, 1: Track, 2: Queue
    public history: Track[] = [];
    public skipped: boolean = false;
    
    private guildId: string;
    private ytdlpProc: any = null;
    private ffmpegProc: any = null;
    private volume: number = 100;

    constructor(guildId: string) {
        this.guildId = guildId;
        this.player = createAudioPlayer();

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.playNext();
        });

        this.player.on('error', (error) => {
            console.error(`[Player Error in guild ${this.guildId}]`, error);
            this.playNext();
        });
    }

    public async connect(member: GuildMember, textChannel: TextChannel) {
        this.textChannel = textChannel;
        
        if (!this.connection || this.connection.state.status === VoiceConnectionStatus.Destroyed) {
            this.connection = joinVoiceChannel({
                channelId: member.voice.channel!.id,
                guildId: this.guildId,
                adapterCreator: member.guild.voiceAdapterCreator as any,
            });

            this.connection.on(VoiceConnectionStatus.Disconnected, () => {
                console.log(`[MusicQueue] Disconnected from voice in ${this.guildId}.`);
                this.stop();
            });

            this.connection.subscribe(this.player);
        }
    }

    public addTrack(track: Track) {
        this.tracks.push(track);
        if (this.player.state.status !== AudioPlayerStatus.Playing && this.player.state.status !== AudioPlayerStatus.Paused && !this.currentTrack) {
            this.playNext();
        }
    }

    public async playNext() {
        this.killProcesses();
        
        const wasSkipped = this.skipped;
        this.skipped = false;
        
        if (this.currentTrack) {
            // Save to history
            this.history.push(this.currentTrack);
            if (this.history.length > 50) this.history.shift();

            // Handle loop modes if not skipped
            if (!wasSkipped) {
                if (this.loopMode === 1) {
                    this.tracks.unshift(this.currentTrack);
                } else if (this.loopMode === 2) {
                    this.tracks.push(this.currentTrack);
                }
            }
        }

        if (this.tracks.length === 0) {
            this.currentTrack = null;
            
            if (!this.autoplay && this.textChannel) {
                this.textChannel.send({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription('⏹️ Queue ended. The bot will leave the voice channel due to inactivity.')] });
            }
            return;
        }

        const track = this.tracks.shift()!;
        this.currentTrack = track;
        this.lastTrack = track;

        // Preemptive Autoplay: Preload the next track immediately while this one starts playing
        if (this.autoplay && this.tracks.length === 0) {
            this.fetchAutoplayTrack();
        }

        if (this.textChannel) {
            this.textChannel.send({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription(`🎶 Now playing: **${track.title}** by *${track.author}* (Requested by: ${track.requestedBy})`)] });
        }

        try {
            // Get audio stream URL from yt-dlp
            this.ytdlpProc = spawn(YTDLP_PATH, [
                '-f', 'bestaudio',
                '-o', '-',
                '--no-playlist',
                '--quiet',
                track.url
            ], { stdio: ['pipe', 'pipe', 'pipe'] });
            
            // Note: Currently not applying volume filter yet, just standard playback
            this.ffmpegProc = spawn(FFMPEG_PATH, [
                '-i', 'pipe:0',
                '-analyzeduration', '0',
                '-loglevel', '0',
                '-f', 's16le',
                '-ar', '48000',
                '-ac', '2',
                'pipe:1'
            ], { stdio: ['pipe', 'pipe', 'pipe'] });

            this.ytdlpProc.stdout.pipe(this.ffmpegProc.stdin);

            // Handle stream errors to prevent EPIPE crashes when stopping/skipping
            this.ytdlpProc.stdout.on('error', (err: any) => {
                if (err.code !== 'EPIPE') console.error('[ytdlp stdout error]', err);
            });
            this.ffmpegProc.stdin.on('error', (err: any) => {
                if (err.code !== 'EPIPE' && err.code !== 'EOF') console.error('[ffmpeg stdin error]', err);
            });

            const resource = createAudioResource(this.ffmpegProc.stdout, {
                inputType: StreamType.Raw,
                inlineVolume: true,
            });
            resource.volume?.setVolume(this.volume / 100);

            this.player.play(resource);
        } catch (error) {
            console.error('[MusicQueue Play Error]', error);
            if (this.textChannel) this.textChannel.send({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ Failed to play the song.')] });
            this.playNext();
        }
    }

    public stop() {
        this.tracks = [];
        this.history = [];
        this.currentTrack = null;
        this.killProcesses();
        if (this.player.state.status !== AudioPlayerStatus.Idle) {
            this.player.stop(true);
        }
        if (this.connection && this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
            this.connection.destroy();
        }
        this.connection = null;
    }

    public skip() {
        if (this.player.state.status === AudioPlayerStatus.Playing || this.player.state.status === AudioPlayerStatus.Paused) {
            this.skipped = true;
            this.player.stop(true); // Triggers Idle -> playNext()
            return true;
        }
        return false;
    }

    public playPrevious() {
        if (this.history.length === 0) return false;
        
        // Remove the last track from history
        const prevTrack = this.history.pop()!;
        
        // If we are currently playing, push it back to the start of the queue so it plays next
        if (this.currentTrack) {
            this.tracks.unshift(this.currentTrack);
        }
        
        // Put the previous track at the very front of the queue
        this.tracks.unshift(prevTrack);
        
        // Nullify currentTrack so playNext doesn't add it to history again
        this.currentTrack = null;
        
        // Force playNext via stop()
        this.skipped = true;
        this.player.stop(true);
        return true;
    }

    public pause() {
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            this.player.pause();
            return true;
        }
        return false;
    }

    public resume() {
        if (this.player.state.status === AudioPlayerStatus.Paused) {
            this.player.unpause();
            return true;
        }
        return false;
    }

    public shuffle() {
        for (let i = this.tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
        }
    }

    public setVolume(vol: number) {
        this.volume = vol;
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            // Get current resource and update volume
            const resource = this.player.state.resource;
            if (resource && resource.volume) {
                resource.volume.setVolume(vol / 100);
            }
        }
    }

    public toggleAutoplay() {
        this.autoplay = !this.autoplay;
        
        // If autoplay is turned on, we are playing a song, and queue is empty, fetch immediately
        if (this.autoplay && this.currentTrack && this.tracks.length === 0) {
            this.fetchAutoplayTrack();
        }
        
        return this.autoplay;
    }

    private fetchAutoplayTrack() {
        if (!this.lastTrack) return;
        
        try {
            let videoId = null;
            const match = this.lastTrack.url.match(/[?&]v=([^&]+)/) || this.lastTrack.url.match(/youtu\.be\/([^?]+)/);
            if (match) {
                videoId = match[1];
            }

            const attemptFetch = (args: string[], fallbackArgs?: string[]) => {
                const proc = spawn(YTDLP_PATH, args, { stdio: ['pipe', 'pipe', 'pipe'] });
                let stdout = '';
                
                proc.stdout.on('data', (d) => stdout += d.toString());
                
                proc.on('close', () => {
                    if (stdout.trim()) {
                        const lines = stdout.trim().split('\n').filter(line => line.trim().length > 0);
                        
                        let filtered = lines.filter(line => !line.includes(this.lastTrack!.url));
                        if (filtered.length === 0) filtered = lines;
                        
                        const randomLine = filtered[Math.floor(Math.random() * filtered.length)];
                        if (randomLine) {
                            const [url, title, author] = randomLine.split('|');
                            this.tracks.push({
                                url: url,
                                title: title || 'Unknown',
                                author: author || 'Unknown',
                                requestedBy: 'Autoplay'
                            });
                            
                            // If player is idle (meaning the current track finished while we were fetching), start playing immediately!
                            if (this.player.state.status === AudioPlayerStatus.Idle) {
                                this.playNext();
                            }
                            return;
                        }
                    }
                    
                    // If we reach here, no track was found in this attempt
                    if (fallbackArgs) {
                        attemptFetch(fallbackArgs);
                    } else if (this.player.state.status === AudioPlayerStatus.Idle) {
                        // All attempts failed and player is idle
                        if (this.textChannel) {
                            this.textChannel.send({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription('⏹️ Autoplay failed to find related songs. Queue ended.')] });
                        }
                        this.autoplay = false;
                    }
                });
            };

            const query = `ytsearch5: ${this.lastTrack.title} audio`;
            const fallbackArgs = ['--print', '%(webpage_url)s|%(title)s|%(channel)s', '--no-playlist', query];
            
            if (videoId) {
                // Try YouTube Mix first
                const mixUrl = `https://www.youtube.com/watch?v=${videoId}&list=RD${videoId}`;
                const args = ['--print', '%(webpage_url)s|%(title)s|%(channel)s', '--playlist-items', '2-6', mixUrl];
                attemptFetch(args, fallbackArgs);
            } else {
                // Not a youtube URL or no video ID, fallback to ytsearch directly
                attemptFetch(fallbackArgs);
            }
        } catch (e) {
            console.error('[Autoplay Fetch Error]', e);
        }
    }

    private killProcesses() {
        if (this.ytdlpProc) {
            this.ytdlpProc.kill();
            this.ytdlpProc = null;
        }
        if (this.ffmpegProc) {
            this.ffmpegProc.kill();
            this.ffmpegProc = null;
        }
    }
}
