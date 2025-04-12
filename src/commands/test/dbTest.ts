import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { IkranRepository } from "../../database/repositories/ikranRepository";
import { Command } from "src/types/command";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your coins balance"),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = await IkranRepository.findOrCreate(interaction.user.id);

    await interaction.reply(
      `💰 Balance:
      Coins: ${user.coins}
      Level: ${user.level}
      XP: ${user.xp}`
    );
  },
} as Command;
