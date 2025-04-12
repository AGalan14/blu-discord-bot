import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import { ExtendedClient } from "../../types/event";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency"),

  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client as ExtendedClient;
    const latency = Math.abs(Date.now() - interaction.createdTimestamp);

    const response = client.lang!.t(interaction, "commands.info.ping.response", {
      latency: latency,
    });

    await interaction.reply(response);
  },
} as Command;
