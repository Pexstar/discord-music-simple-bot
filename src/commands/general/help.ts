import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show a list of all available commands'),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const commands = client.commands;

        const categories: Record<string, string[]> = {};

        commands.forEach((cmd) => {
            const category = cmd.category || 'others';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(`\`/${cmd.data.name}\` - ${cmd.data.description}`);
        });

        const embed = new EmbedBuilder()
            .setTitle('🤖 Discord Music Bot Commands List')
            .setColor('#9000FF')
            .setFooter({ text: 'Discord Music Bot' });

        for (const [category, cmdList] of Object.entries(categories)) {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1) + ' Commands';
            let emoji = '⚙️';
            if (category === 'music') emoji = '🎵';
            else if (category === 'general') emoji = '🛠️';

            embed.addFields({ 
                name: `${emoji} ${categoryName}`, 
                value: cmdList.join('\n')
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};

export default command;
