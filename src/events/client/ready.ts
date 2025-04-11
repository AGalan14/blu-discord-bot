import { Events } from "discord.js";
import { ExtendedClient, Event } from "../../types/event";
import { loadCommands } from "../../handlers/commandHandler";
import { resolve } from "path";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: ExtendedClient) {
    console.log(`🤖 Bot conectado como ${client.user?.tag}`);
    client.commands = await loadCommands(
      resolve(__dirname, "../../commands"),
      client.lang! // Pasa el LanguageManager al handler
    );
  },
} as Event;
