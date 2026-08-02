import { SlashCommandBuilder, GuildMember } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ content: '❌ Kamu harus masuk ke voice channel dulu!', ephemeral: true });
            return;
        }

        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || !queue.currentTrack) {
            await interaction.reply({ content: '❌ Tidak ada lagu yang dijeda.', ephemeral: true });
            return;
        }

        if (queue.resume()) {
            await interaction.reply('▶️ Musik dilanjutkan.');
        } else {
            await interaction.reply({ content: '❌ Musik tidak sedang dijeda.', ephemeral: true });
        }
    },
};

export default command;
