import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current music queue'),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || (!queue.currentTrack && queue.tracks.length === 0)) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ The queue is empty.')], ephemeral: true });
            return;
        }

        const tracks = queue.tracks;
        const totalPages = Math.ceil(tracks.length / 10) || 1;
        let currentPage = 1;

        const generateEmbed = (page: number) => {
            const embed = new EmbedBuilder()
                .setTitle('🎶 Music Queue')
                .setColor('#9000FF')
                .setFooter({ text: `Page ${page} of ${totalPages} | Total: ${tracks.length} songs` });

            let description = '';

            if (page === 1 && queue.currentTrack) {
                description += `**Now Playing:**\n[${queue.currentTrack.title}](${queue.currentTrack.url}) by *${queue.currentTrack.author}* - Requested by ${queue.currentTrack.requestedBy}\n\n`;
            }

            if (tracks.length > 0) {
                description += `**Up Next:**\n`;
                const start = (page - 1) * 10;
                const end = start + 10;
                const currentTracks = tracks.slice(start, end);

                currentTracks.forEach((track, index) => {
                    description += `**${start + index + 1}.** [${track.title}](${track.url}) by *${track.author}* - ${track.requestedBy}\n`;
                });
            }

            embed.setDescription(description);
            return embed;
        };

        const getRow = (page: number) => {
            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev_page')
                        .setLabel('⬅️ Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('next_page')
                        .setLabel('Next ➡️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === totalPages)
                );
            return row;
        };

        const embed = generateEmbed(currentPage);
        const components = totalPages > 1 ? [getRow(currentPage)] : [];

        await interaction.reply({ 
            embeds: [embed], 
            components: components as any[]
        });

        if (totalPages > 1) {
            const response = await interaction.fetchReply();
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async i => {
                if (i.user.id !== interaction.user.id) {
                    await i.reply({ content: '❌ You cannot use this button because you did not run this command!', ephemeral: true });
                    return;
                }

                if (i.customId === 'prev_page') {
                    currentPage--;
                } else if (i.customId === 'next_page') {
                    currentPage++;
                }

                await i.update({ 
                    embeds: [generateEmbed(currentPage)], 
                    components: [getRow(currentPage) as any] 
                });
            });

            collector.on('end', async () => {
                const disabledRow = getRow(currentPage);
                disabledRow.components.forEach(c => c.setDisabled(true));
                try {
                    await interaction.editReply({ components: [disabledRow as any] });
                } catch (e) {
                    // Message might have been deleted by user, ignore
                }
            });
        }
    },
};

export default command;
