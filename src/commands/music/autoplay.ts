import { SlashCommandBuilder, GuildMember } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle autoplay to play related songs when the queue is empty'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ content: '❌ Kamu harus masuk ke voice channel dulu!', ephemeral: true });
            return;
        }

        const client = interaction.client as ExtendedClient;
        const queue = client.getQueue(interaction.guildId!);

        const isAutoplay = queue.toggleAutoplay();
        
        await interaction.reply(`🔂 Autoplay sekarang **${isAutoplay ? 'AKTIF' : 'NONAKTIF'}**.`);
    },
};

export default command;
