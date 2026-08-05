import { SlashCommandBuilder, GuildMember, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ You must be in a voice channel first!')], ephemeral: true });
            return;
        }

        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || !queue.currentTrack) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ There is no paused song.')], ephemeral: true });
            return;
        }

        if (queue.resume()) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription('▶️ Music resumed.')] });
        } else {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ Music is not paused.')], ephemeral: true });
        }
    },
};

export default command;
