import { SlashCommandBuilder, GuildMember } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music, clear the queue, and leave the voice channel'),
    async execute(interaction) {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ content: '❌ Kamu harus masuk ke voice channel dulu!', ephemeral: true });
            return;
        }

        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || !queue.connection) {
            await interaction.reply({ content: '❌ Bot tidak sedang memutar musik.', ephemeral: true });
            return;
        }

        client.destroyQueue(interaction.guildId!);
        await interaction.reply('⏹️ Musik dihentikan dan antrian dibersihkan. Bye!');
    },
};

export default command;
