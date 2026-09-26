// Translations work like Laravel's JSON files: the English text is the key.
//
//   const __ = useTranslations(Astro.currentLocale);
//   __("Download CV")                         "Descargar CV" on /es pages
//   __("Replies within :time", { time: "24h" })
//
// English needs no file, and a missing translation falls back to the English
// text instead of breaking. `npm run i18n:check` lists missing and unused keys.
import es from "./es.json";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Region-specific codes for Open Graph, the sitemap and date/time formatting
export const localeCodes: Record<Locale, string> = { en: "en-US", es: "es-CO" };

const dictionaries: Partial<Record<Locale, Record<string, string>>> = { es };

// Routes that only exist in English: their links never get a /es prefix.
// Blog posts do have a /es page (Spanish interface), but their text stays in English
const englishOnly = ["/rss.xml"];

export function getLocale(locale: string | undefined): Locale {
    return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
}

export function useTranslations(locale: string | undefined) {
    const dictionary = dictionaries[getLocale(locale)] ?? {};

    return (text: string, params: Record<string, string | number> = {}) =>
        (dictionary[text] ?? text).replace(/:(\w+)/g, (match, key: string) => (key in params ? String(params[key]) : match));
}

// "/es/about" -> "/about"
export function stripLocale(path: string) {
    const prefix = new RegExp(`^/(${locales.filter((locale) => locale !== defaultLocale).join("|")})(?=/|$)`);
    return path.replace(prefix, "") || "/";
}

export function isTranslated(path: string) {
    const page = stripLocale(path);
    return !englishOnly.some((route) => page === route || page.startsWith(`${route}/`));
}

// "/about" -> "/es/about" (English has no prefix). External links, anchors
// and English-only pages are returned untouched
export function localizePath(path: string, locale: string | undefined) {
    const target = getLocale(locale);
    if (!path.startsWith("/") || !isTranslated(path)) return path;

    const page = stripLocale(path);
    if (target === defaultLocale) return page;

    return page === "/" ? `/${target}` : `/${target}${page}`;
}
