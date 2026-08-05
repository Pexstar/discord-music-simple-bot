import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Show information about this server'),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ This command can only be used in a server.')], ephemeral: true });
            return;
        }

        const owner = await guild.fetchOwner();
        
        const embed = new EmbedBuilder()
            .setTitle(`Server Info: ${guild.name}`)
            .setThumbnail(guild.iconURL({ size: 1024, extension: 'png' }))
            .addFields(
                { name: 'Owner', value: owner.user.tag, inline: true },
                { name: 'Total Members', value: guild.memberCount.toString(), inline: true },
                { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                { name: 'Server ID', value: guild.id, inline: true }
            )
            .setColor('#9000FF');

        await interaction.reply({ embeds: [embed] });
    },
};

export default command;
