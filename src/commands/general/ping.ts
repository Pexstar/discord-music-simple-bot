import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../structures/Command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with bot latency'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        
        await interaction.editReply(`Pong! 🏓\nBot Latency: ${latency}ms\nAPI Latency: ${interaction.client.ws.ping}ms`);
    },
};

export default command;
