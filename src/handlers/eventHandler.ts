import { ExtendedClient } from '../structures/ExtendedClient';
import { ActivityType } from 'discord.js';

export const loadEvents = (client: ExtendedClient) => {
    client.once('clientReady', async () => {
        console.log(`Ready! Logged in as ${client.user?.tag}`);

        const activities = [
            { name: '🎵 /play to listen to music', type: ActivityType.Custom },
            { name: '🎶 Autoplay 24/7 Enabled!', type: ActivityType.Custom },
            { name: '📻 /help for commands', type: ActivityType.Custom }
        ];

        let i = 0;
        setInterval(() => {
            const activity = activities[i++ % activities.length];
            client.user?.setActivity(activity);
        }, 15000); // Changes every 15 seconds
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });
};
