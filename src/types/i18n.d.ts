import enTranslations from "../locales/en.json";

type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}${T[K] extends object
        ? `.${DeepKeys<T[K]>}`
        : ""}`;
    }[keyof T]
  : "";

type TranslationPaths = DeepKeys<typeof enTranslations>;

declare global {
  type I18nPath = TranslationPaths;
}
