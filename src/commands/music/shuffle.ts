import { SlashCommandBuilder, GuildMember } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current music queue'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ content: '❌ Kamu harus masuk ke voice channel dulu!', ephemeral: true });
            return;
        }

        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || queue.tracks.length === 0) {
            await interaction.reply({ content: '❌ Antrian lagu kosong.', ephemeral: true });
            return;
        }

        queue.shuffle();
        await interaction.reply('🔀 Antrian lagu telah diacak.');
    },
};

export default command;
