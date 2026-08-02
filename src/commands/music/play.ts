import { SlashCommandBuilder, GuildMember, TextChannel } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';
import { spawn } from 'child_process';
import { resolve } from 'path';

const YTDLP_PATH = resolve(__dirname, '../../../node_modules/youtube-dl-exec/bin/yt-dlp.exe');

// Check if query is a YouTube URL
function isYouTubeURL(query: string): boolean {
    return /(?:youtube\.com|youtu\.be|music\.youtube\.com)/.test(query);
}

// Search YouTube via yt-dlp and return video URL
async function searchYouTube(query: string): Promise<{ url: string; title: string; author: string } | null> {
    return new Promise((resolve) => {
        const args = isYouTubeURL(query) 
            ? ['--print', '%(webpage_url)s|%(title)s|%(channel)s', '--no-playlist', query]
            : ['--print', '%(webpage_url)s|%(title)s|%(channel)s', '--no-playlist', '--default-search', 'ytsearch1', query];

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
            const lines = stdout.trim().split('\n');
            const [url, title, author] = lines[0].split('|');
            resolve({ url, title: title || 'Unknown', author: author || 'Unknown' });
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
            await interaction.reply({ content: '❌ Kamu harus masuk ke voice channel dulu!', ephemeral: true });
            return;
        }

        await interaction.deferReply();
        const client = interaction.client as ExtendedClient;
        const queue = client.getQueue(interaction.guildId!);

        try {
            console.log(`[Play] Searching: ${query}`);
            const result = await searchYouTube(query);

            if (!result) {
                await interaction.editReply('❌ Lagu tidak ditemukan.');
                return;
            }

            console.log(`[Play] Found: ${result.title} by ${result.author}`);

            await queue.connect(member, interaction.channel as TextChannel);
            
            queue.addTrack({
                url: result.url,
                title: result.title,
                author: result.author,
                requestedBy: interaction.user.tag
            });

            await interaction.editReply(`🎶 Berhasil ditambahkan ke antrian: **${result.title}** by *${result.author}*`);

        } catch (e: any) {
            console.error('[Play Error]', e);
            await interaction.editReply('❌ Terjadi error saat memutar lagu.');
        }
    },
};

export default command;
