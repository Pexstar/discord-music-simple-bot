import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with bot latency'),
    async execute(interaction) {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription('Pinging...')] });
        const sent = await interaction.fetchReply();
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        
        await interaction.editReply({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription(`Pong! 🏓\nBot Latency: ${latency}ms\nAPI Latency: ${interaction.client.ws.ping}ms`)] });
    },
};

export default command;
