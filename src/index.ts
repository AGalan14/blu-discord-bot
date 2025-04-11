import { Client } from "discord.js";
import * as dotenv from "dotenv";
import { ExtendedClient } from "./types/event";
import { loadEvents } from "./handlers/eventHandler";
import { resolve } from "path";
import { LanguageManager } from "./utils/languageManager";

dotenv.config();

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
}) as ExtendedClient;

// Definir el sistema multi-idioma
client.lang = new LanguageManager();

// Cargar eventos
loadEvents(client, resolve(__dirname, "./events"));

client.login(process.env.DISCORD_TOKEN);
