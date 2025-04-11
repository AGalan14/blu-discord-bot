import { readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { ExtendedClient, Event } from "../types/event";

export async function loadEvents(client: ExtendedClient, eventsPath: string) {
  const normalizedPath = resolve(eventsPath);

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
        const eventModule = require(filePath);
        const event = eventModule.default as Event;

        if (!event?.name || !event?.execute) {
          console.log(`⚠️ Evento en ${filePath} no tiene name o execute`);
          continue;
        }

        const method = event.once ? "once" : "on";
        client[method](event.name, (...args) => event.execute(client, ...args));
        console.log(`✅ Evento cargado: ${event.name}`);
      }
    }
  }

  walkDirectory(normalizedPath);
}
