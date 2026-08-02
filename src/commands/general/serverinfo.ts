import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Tampilkan informasi tentang server ini'),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild) {
            await interaction.reply({ content: '❌ Command ini hanya bisa digunakan di dalam server.', ephemeral: true });
            return;
        }

        const owner = await guild.fetchOwner();
        
        const embed = new EmbedBuilder()
            .setTitle(`Info Server: ${guild.name}`)
            .setThumbnail(guild.iconURL({ size: 1024, extension: 'png' }))
            .addFields(
                { name: 'Pemilik', value: owner.user.tag, inline: true },
                { name: 'Total Member', value: guild.memberCount.toString(), inline: true },
                { name: 'Dibuat Pada', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                { name: 'Server ID', value: guild.id, inline: true }
            )
            .setColor('#2b2d31');

        await interaction.reply({ embeds: [embed] });
    },
};

export default command;
