import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Tampilkan daftar semua command yang tersedia'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🤖 Daftar Command Discord Music Bot')
            .setColor('#2b2d31')
            .addFields(
                { name: '🎵 Music Commands', value: `
\`/play <query>\` - Putar lagu atau masukkan ke antrian
\`/stop\` - Hentikan musik dan keluar
\`/skip\` - Lewati lagu saat ini
\`/pause\` - Jeda lagu
\`/resume\` - Lanjutkan lagu
\`/queue\` - Lihat antrian lagu
\`/nowplaying\` - Lihat lagu yang sedang diputar
\`/volume <1-200>\` - Atur volume
\`/shuffle\` - Acak antrian lagu
\`/autoplay\` - Otomatis memutar lagu terkait saat antrian habis
                `.trim() },
                { name: '🛠️ General Commands', value: `
\`/ping\` - Cek latensi bot
\`/help\` - Tampilkan pesan bantuan ini
\`/avatar [user]\` - Lihat avatar user
\`/serverinfo\` - Info server
                `.trim() }
            )
            .setFooter({ text: 'Discord Music Bot' });

        await interaction.reply({ embeds: [embed] });
    },
};

export default command;
