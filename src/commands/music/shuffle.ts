import { SlashCommandBuilder, GuildMember, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current music queue'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ You must be in a voice channel first!')], ephemeral: true });
            return;
        }

        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || queue.tracks.length === 0) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ The queue is empty.')], ephemeral: true });
            return;
        }

        queue.shuffle();
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription('🔀 The queue has been shuffled.')] });
    },
};

export default command;
