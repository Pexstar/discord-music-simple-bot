import { SlashCommandBuilder, GuildMember } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set the volume of the music player')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Volume amount (1-200)')
                .setMinValue(1)
                .setMaxValue(200)
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount', true);
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ content: '❌ Kamu harus masuk ke voice channel dulu!', ephemeral: true });
            return;
        }

        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || !queue.currentTrack) {
            await interaction.reply({ content: '❌ Tidak ada lagu yang sedang diputar.', ephemeral: true });
            return;
        }

        queue.setVolume(amount);
        await interaction.reply(`🔊 Volume diatur ke **${amount}%**.`);
    },
};

export default command;
