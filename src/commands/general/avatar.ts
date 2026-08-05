import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("Show a user's avatar")
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user whose avatar you want to view')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        
        const embed = new EmbedBuilder()
            .setTitle(`${user.tag}'s Avatar`)
            .setImage(user.displayAvatarURL({ size: 1024, extension: 'png' }))
            .setColor('#9000FF');

        await interaction.reply({ embeds: [embed] });
    },
};

export default command;
