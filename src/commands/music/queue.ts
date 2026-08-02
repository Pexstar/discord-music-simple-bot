import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current music queue'),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || (!queue.currentTrack && queue.tracks.length === 0)) {
            await interaction.reply({ content: '❌ Antrian lagu kosong.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('🎶 Antrian Lagu')
            .setColor('#2b2d31');

        let description = '';

        if (queue.currentTrack) {
            description += `**Sedang Diputar:**\n[${queue.currentTrack.title}](${queue.currentTrack.url}) by *${queue.currentTrack.author}* - Ditambahkan oleh ${queue.currentTrack.requestedBy}\n\n`;
        }

        if (queue.tracks.length > 0) {
            description += `**Selanjutnya:**\n`;
            const tracks = queue.tracks.slice(0, 10);
            tracks.forEach((track, index) => {
                description += `**${index + 1}.** [${track.title}](${track.url}) by *${track.author}* - ${track.requestedBy}\n`;
            });
            if (queue.tracks.length > 10) {
                description += `\n*...dan ${queue.tracks.length - 10} lagu lainnya.*`;
            }
        }

        embed.setDescription(description);
        await interaction.reply({ embeds: [embed] });
    },
};

export default command;
