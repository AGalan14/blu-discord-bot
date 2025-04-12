import { Events } from "discord.js";
import { AppDataSource } from "../../database/data-source";
import { ExtendedClient, Event } from "../../types/event";
import { loadCommands } from "../../handlers/commandHandler";
import { resolve } from "path";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: ExtendedClient) {
    try {
      await AppDataSource.initialize();
      console.log("✅ Database connected");

      console.log(`🤖 Bot conectado como ${client.user?.tag}`);
      client.commands = await loadCommands(
        resolve(__dirname, "../../commands"),
        client.lang! // Pasa el LanguageManager al handler
      );
    } catch (error) {
      console.error("❌ Database connection error:", error);
      process.exit(1);
    }
  },
} as Event;
