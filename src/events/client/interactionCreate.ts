import { Events, Interaction } from "discord.js";
import { ExtendedClient, Event } from "../../types/event";

export default {
  name: Events.InteractionCreate,
  async execute(client: ExtendedClient, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands?.get(interaction.commandName);

    if (!command) {
      console.error(`❌ Comando ${interaction.commandName} no encontrado`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Hubo un error al ejecutar el comando",
        ephemeral: true,
      });
    }
  },
} as Event;
