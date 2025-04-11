import { Client, Collection, Events } from "discord.js";
import { LanguageManager } from '../utils/languageManager';
import { Command } from "./command";

export interface ExtendedClient extends Client {
  commands?: Collection<string, Command>;
  lang?: LanguageManager;
}

export interface Event {
  name: keyof typeof Events | string;
  once?: boolean;
  execute: (client: ExtendedClient, ...args: any[]) => Promise<void> | void;
}
