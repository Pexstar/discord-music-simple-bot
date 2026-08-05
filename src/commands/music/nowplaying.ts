import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show information about the currently playing song'),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || !queue.currentTrack) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ There is no song currently playing.')], ephemeral: true });
            return;
        }

        const track = queue.currentTrack;

        const embed = new EmbedBuilder()
            .setTitle('🎶 Now Playing')
            .setDescription(`[${track.title}](${track.url})`)
            .addFields(
                { name: 'Author', value: track.author, inline: true },
                { name: 'Requested By', value: track.requestedBy, inline: true }
            )
            .setColor('#9000FF');

        await interaction.reply({ embeds: [embed] });
    },
};

export default command;
