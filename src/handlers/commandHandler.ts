import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { Command } from "../types/command";
import { Collection } from "discord.js";
import { LanguageManager } from "../utils/languageManager";

export async function loadCommands(
  commandsPath: string,
  langManager: LanguageManager
) {
  const commands = new Collection<string, Command>();
  const commandData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  const normalizedPath = resolve(commandsPath);

  function walkDirectory(directory: string) {
    const files = readdirSync(directory);

    for (const file of files) {
      const filePath = join(directory, file);
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        walkDirectory(filePath);
      } else if (
        stat.isFile() &&
        (file.endsWith(".ts") || file.endsWith(".js"))
      ) {
        const commandModule = require(filePath);
        const command = commandModule.default as Command;

        if (!command?.data || !command?.execute) {
          console.log(`⚠️ Comando en ${filePath} no tiene data o execute`);
          continue;
        }

        // Aplicar localizaciones
        const descriptionKey = `commands.${command.data.name}.description`;
        langManager.applyCommandLocalizations(command.data, descriptionKey);

        commands.set(command.data.name, command);
        commandData.push(command.data.toJSON());
        console.log(`✅ Comando cargado: ${command.data.name}`);
      }
    }
  }

  walkDirectory(normalizedPath);

  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log(`🔄 Registrando ${commandData.length} comandos...`);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!
      ),
      { body: commandData }
    );

    console.log("✅ Comandos registrados exitosamente");
  } catch (error) {
    console.error("❌ Error al registrar comandos:", error);
  }

  return commands;
}
