import { SlashCommandBuilder, GuildMember, EmbedBuilder } from 'discord.js';
import { Command } from '../../structures/Command';
import { ExtendedClient } from '../../structures/ExtendedClient';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle repeat mode')
        .addIntegerOption(option => 
            option.setName('mode')
                .setDescription('Loop mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 0 },
                    { name: 'Track', value: 1 },
                    { name: 'Queue', value: 2 }
                )
        ),
    async execute(interaction) {
        const mode = interaction.options.getInteger('mode', true) as 0 | 1 | 2;
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ You must be in a voice channel first!')], ephemeral: true });
            return;
        }

        const client = interaction.client as ExtendedClient;
        const queue = client.queues.get(interaction.guildId!);

        if (!queue || !queue.currentTrack) {
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('❌ There is no song currently playing.')], ephemeral: true });
            return;
        }

        queue.loopMode = mode;
        const modeName = mode === 0 ? 'Off' : (mode === 1 ? 'Track' : 'Queue');
        
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#9000FF').setDescription(`🔁 Loop mode changed to: **${modeName}**`)] });
    },
};

export default command;
