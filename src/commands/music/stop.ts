import { SlashCommandBuilder, GuildMember, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music, clear the queue, and leave the voice channel'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ You must be in a voice channel first!')], ephemeral: true });
            return;
        }

        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || !queue.connection) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ The bot is not playing any music.')], ephemeral: true });
            return;
        }

        client.destroyQueue(interaction.guildId!);
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription('⏹️ Music stopped and queue cleared. Bye!')] });
    },
};

export default command;
