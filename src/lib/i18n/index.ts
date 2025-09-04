export const locales = ["es", "en", "zh"] as const;
export type Locale = (typeof locales)[number];
