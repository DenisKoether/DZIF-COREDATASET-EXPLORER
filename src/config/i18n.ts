import { derived, writable } from "svelte/store";
import { uiTexts, type Language, type TextKey } from "./translations";

export type { Language, TextKey };

export const SUPPORTED_LANGUAGES: Language[] = ["de", "en"];
export const DEFAULT_LANGUAGE: Language = "de";

const STORAGE_KEY = "dzif-explorer-language";

const isLanguage = (value: unknown): value is Language =>
  typeof value === "string" &&
  (SUPPORTED_LANGUAGES as string[]).includes(value);

/** Stored choice wins, otherwise fall back to the browser language, otherwise German. */
const initialLanguage = (): Language => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    /* localStorage can be unavailable (private mode, blocked cookies) */
  }

  const browserLanguage = window.navigator.language?.slice(0, 2).toLowerCase();
  return isLanguage(browserLanguage) ? browserLanguage : DEFAULT_LANGUAGE;
};

export const language = writable<Language>(initialLanguage());

language.subscribe((current) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = current;
  try {
    window.localStorage.setItem(STORAGE_KEY, current);
  } catch {
    /* not persisting is acceptable, the language still applies for this session */
  }
});

export const setLanguage = (next: Language) => language.set(next);

/**
 * Translate a key for the active language. Use as `$t('search_button')`.
 * `values` fills `{placeholder}` slots, e.g. `$t('chart_filter_count', { total: 17 })`.
 */
export const t = derived(
  language,
  ($language) =>
    (key: TextKey, values?: Record<string, string | number>): string => {
      const text = uiTexts[key]?.[$language] ?? String(key);
      if (!values) return text;
      return Object.entries(values).reduce(
        (result, [name, value]) =>
          result.replaceAll(`{${name}}`, String(value)),
        text,
      );
    },
);
