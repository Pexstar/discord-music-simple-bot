import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Command } from './Command';
import { MusicQueue } from './MusicQueue';
import dotenv from 'dotenv';
dotenv.config();

export class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public queues: Collection<string, MusicQueue> = new Collection();

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
            ]
        });
    }

    public getQueue(guildId: string): MusicQueue {
        let queue = this.queues.get(guildId);
        if (!queue) {
            queue = new MusicQueue(guildId);
            this.queues.set(guildId, queue);
        }
        return queue;
    }

    public destroyQueue(guildId: string) {
        const queue = this.queues.get(guildId);
        if (queue) {
            queue.stop();
            this.queues.delete(guildId);
        }
    }
}
