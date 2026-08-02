import { ExtendedClient } from './structures/ExtendedClient';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';

const client = new ExtendedClient();

// Load Events
loadEvents(client);

// Login and Load Commands
client.login(process.env.DISCORD_TOKEN).then(() => {
    loadCommands(client);
}).catch((err) => {
    console.error("Failed to login. Please check your DISCORD_TOKEN in .env file.", err);
});
