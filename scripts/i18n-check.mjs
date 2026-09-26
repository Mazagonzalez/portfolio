// Compares the texts passed to __("...") with src/i18n/es.json:
//   - missing: used in the code but not translated (fails)
//   - placeholders: ":name" in the key but not in the translation, or vice versa (fails)
//   - unused: in es.json but the text no longer appears anywhere in src (warning)
//
//   npm run i18n:check
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DICTIONARY = "src/i18n/es.json";

const sources = readdirSync("src", { recursive: true })
    // .md too: project descriptions live in the content frontmatter
    .filter((file) => /\.(astro|ts|tsx|js|jsx|mjs|md)$/.test(file))
    .map((file) => ({ file: join("src", file), code: readFileSync(join("src", file), "utf8") }));

const dictionary = JSON.parse(readFileSync(DICTIONARY, "utf8"));

// __("text") and __('text'). Dynamic calls like __(item.role) can't be read,
// but their texts still count as "used" if they appear as a string in src
const calls = new Map();
for (const { file, code } of sources) {
    for (const [, quote, raw] of code.matchAll(/__\(\s*(["'])((?:\\.|(?!\1)[^\\])*)\1/g)) {
        const text = quote === '"' ? JSON.parse(`"${raw}"`) : raw.replace(/\\'/g, "'");
        if (!calls.has(text)) calls.set(text, file);
    }
}

const placeholders = (text) => [...text.matchAll(/:(\w+)/g)].map((match) => match[1]).sort().join(",");

const missing = [...calls].filter(([text]) => !(text in dictionary));
const mismatched = Object.entries(dictionary).filter(([key, value]) => placeholders(key) !== placeholders(value));
const unused = Object.keys(dictionary).filter((key) => !calls.has(key) && !sources.some(({ code }) => code.includes(key)));

for (const [text, file] of missing) console.error(`✗ missing      "${text}"  (${file})`);
for (const [key, value] of mismatched) console.error(`✗ placeholders "${key}" → "${value}"`);
for (const key of unused) console.warn(`! unused       "${key}"`);

const total = Object.keys(dictionary).length;
console.log(`\n${total} translations, ${missing.length} missing, ${mismatched.length} with wrong placeholders, ${unused.length} unused`);

if (missing.length > 0 || mismatched.length > 0) process.exit(1);
