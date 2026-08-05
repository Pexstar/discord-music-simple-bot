import { SlashCommandBuilder, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';
import { spawn } from 'child_process';
import { resolve } from 'path';

const { constants: ytdlConstants } = require('youtube-dl-exec');

const YTDLP_PATH = ytdlConstants.YOUTUBE_DL_PATH;
// Check if query is a YouTube URL
function isYouTubeURL(query: string): boolean {
    return /(?:youtube\.com|youtu\.be|music\.youtube\.com)/.test(query);
}

function isPlaylistURL(query: string): boolean {
    return isYouTubeURL(query) && /[?&]list=/.test(query);
}

// Search YouTube via yt-dlp and return video URLs
async function searchYouTube(query: string): Promise<{ url: string; title: string; author: string }[] | null> {
    return new Promise((resolve) => {
        const isPlaylist = isPlaylistURL(query);
        let args: string[] = [];

        if (isPlaylist) {
            args = ['--print', '%(id)s|%(title)s|%(channel)s', '--flat-playlist', '--playlist-items', '1-50', query];
        } else if (isYouTubeURL(query)) {
            args = ['--print', '%(id)s|%(title)s|%(channel)s', '--no-playlist', query];
        } else {
            args = ['--print', '%(id)s|%(title)s|%(channel)s', '--no-playlist', '--default-search', 'ytsearch1', query];
        }

        const proc = spawn(YTDLP_PATH, args, { stdio: ['pipe', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';
        proc.stdout.on('data', (d) => stdout += d.toString());
        proc.stderr.on('data', (d) => stderr += d.toString());
        proc.on('close', (code) => {
            if (code !== 0 || !stdout.trim()) {
                console.error('[yt-dlp search error]', stderr);
                resolve(null);
                return;
            }
            
            const results: { url: string; title: string; author: string }[] = [];
            const lines = stdout.trim().split('\n');
            
            for (const line of lines) {
                if (!line.trim()) continue;
                const [id, title, author] = line.split('|');
                
                // Construct the video URL from ID (or use as-is if it's already a URL somehow)
                const url = (id.startsWith('http') || id.startsWith('www')) ? id : `https://www.youtube.com/watch?v=${id}`;
                
                results.push({ 
                    url, 
                    title: title && title !== 'NA' ? title : 'Unknown', 
                    author: author && author !== 'NA' ? author : 'Unknown' 
                });
            }
            
            resolve(results.length > 0 ? results : null);
        });
    });
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube or add to queue')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('The song title or YouTube URL')
                .setRequired(true)
        ),
    async execute(interaction) {
        const query = interaction.options.getString('query', true);
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ You must be in a voice channel first!')], ephemeral: true });
            return;
        }

        await interaction.deferReply();
        const client = interaction.client as ExtendedClient;
        const queue = client.getQueue(interaction.guildId!);

        try {
            console.log(`[Play] Searching: ${query}`);
            const results = await searchYouTube(query);

            if (!results || results.length === 0) {
                await interaction.editReply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ Song or playlist not found.')] });
                return;
            }

            console.log(`[Play] Found: ${results.length} tracks`);

            await queue.connect(member, interaction.channel as TextChannel);
            
            let addedCount = 0;
            for (const track of results) {
                queue.addTrack({
                    url: track.url,
                    title: track.title,
                    author: track.author,
                    requestedBy: interaction.user.tag
                });
                addedCount++;
            }

            if (addedCount > 1) {
                await interaction.editReply({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription(`🎶 Successfully added to the queue: **${addedCount}** songs from the playlist.`)] });
            } else {
                await interaction.editReply({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription(`🎶 Successfully added to the queue: **${results[0].title}** by *${results[0].author}*`)] });
            }

        } catch (e: any) {
            console.error('[Play Error]', e);
            await interaction.editReply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ An error occurred while playing the song.')] });
        }
    },
};

export default command;
