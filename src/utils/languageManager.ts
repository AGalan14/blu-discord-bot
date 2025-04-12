import { readdirSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { ChatInputCommandInteraction, Locale } from "discord.js";

// Mapeo de idiomas base a locales de Discord
const DISCORD_LOCALES_MAP: Record<string, Locale[]> = {
  es: [Locale.SpanishES, Locale.SpanishLATAM],
  en: [Locale.EnglishUS, Locale.EnglishGB],
};

export class LanguageManager {
  private languages: Map<string, any> = new Map();
  private defaultLanguage: string = "en";

  constructor() {
    this.loadLanguages();
  }

  private loadLanguages() {
    const localesPath = resolve(__dirname, "../locales");
    const files = readdirSync(localesPath);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const langCode = file.split(".")[0];
      const filePath = join(localesPath, file);
      const data = JSON.parse(readFileSync(filePath, "utf-8"));

      this.languages.set(langCode, data);
      console.log(`🌐 Idioma cargado: ${langCode}`);
    }
  }

  public getBaseLanguage(locale: string): string {
    if (locale.startsWith("es")) return "es";
    if (locale.startsWith("en")) return "en";
    return this.defaultLanguage;
  }

  public getTranslation(langCode: string, key: string): string | null {
    const language =
      this.languages.get(langCode) || this.languages.get(this.defaultLanguage);
    return this.resolveKey(language, key);
  }

  private resolveKey(obj: any, key: string): string | null {
    return key.split(".").reduce((o, i) => o?.[i], obj) || null;
  }

  public t(
    interaction: ChatInputCommandInteraction,
    key: I18nPath,
    variables?: Record<string, any>
  ): string {
    const baseLang = this.getBaseLanguage(interaction.locale);
    const raw = this.getTranslation(baseLang, key) || key;
    return this.replaceVariables(raw, variables);
  }

  private replaceVariables(
    text: string,
    variables?: Record<string, any>
  ): string {
    if (!variables) return text;

    return Object.entries(variables).reduce((acc, [key, value]) => {
      return acc.replace(new RegExp(`{${key}}`, "g"), value.toString());
    }, text);
  }

  // Método para obtener localizaciones de Discord
  public getDiscordLocales(baseLang: string): string[] {
    return DISCORD_LOCALES_MAP[baseLang] || [];
  }

  // Método para aplicar descripciones localizadas
  public applyCommandLocalizations(command: any, descriptionKey: string) {
    for (const [baseLang, locales] of Object.entries(DISCORD_LOCALES_MAP)) {
      const translation = this.getTranslation(baseLang, descriptionKey);

      if (translation) {
        locales.forEach((locale) => {
          try {
            command.setDescriptionLocalization(locale, translation);
          } catch (error) {
            console.warn(`⚠️ Locale no soportado: ${locale}`);
          }
        });
      }
    }
  }
}
