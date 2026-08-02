import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Tampilkan avatar user')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('User yang ingin dilihat avatarnya')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        
        const embed = new EmbedBuilder()
            .setTitle(`Avatar ${user.tag}`)
            .setImage(user.displayAvatarURL({ size: 1024, extension: 'png' }))
            .setColor('#2b2d31');

        await interaction.reply({ embeds: [embed] });
    },
};

export default command;
