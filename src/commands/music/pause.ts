import { SlashCommandBuilder, GuildMember } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the currently playing song'),
    async execute(interaction) {
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

        if (queue.pause()) {
            await interaction.reply('⏸️ Musik dijeda.');
        } else {
            await interaction.reply({ content: '❌ Musik sudah dalam keadaan jeda atau tidak bisa dijeda.', ephemeral: true });
        }
    },
};

export default command;
