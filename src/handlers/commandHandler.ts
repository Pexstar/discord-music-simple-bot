import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { ExtendedClient } from '../structures/ExtendedClient';
import { Command } from '../structures/Command';

export const loadCommands = async (client: ExtendedClient) => {
    const commandsArray: any[] = [];
    const commandsPath = path.join(__dirname, '..', 'commands');
    
    if (!fs.existsSync(commandsPath)) return;

    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command: Command = require(filePath).default;
            
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commandsArray.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    try {
        console.log('Started refreshing application (/) commands.');

        if (process.env.GUILD_ID) {
            // Register to a specific test guild (instant)
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID),
                { body: commandsArray },
            );
            console.log('Successfully reloaded guild (/) commands.');
        } else {
            // Register globally (takes up to 1 hour to propagate)
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID!),
                { body: commandsArray },
            );
            console.log('Successfully reloaded global (/) commands.');
        }
    } catch (error) {
        console.error(error);
    }
};
