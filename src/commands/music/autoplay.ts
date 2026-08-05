import { SlashCommandBuilder, GuildMember, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle autoplay to play related songs when the queue is empty'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ You must be in a voice channel first!')], ephemeral: true });
            return;
        }

        const client = interaction.client as ExtendedClient;
        const queue = client.getQueue(interaction.guildId!);

        const isAutoplay = queue.toggleAutoplay();
        
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription(`🔂 Autoplay sekarang **${isAutoplay ? 'AKTIF' : 'NONAKTIF'}**.`)] });
    },
};

export default command;
