// Drafts a new blog post with Gemini (free tier) and saves it in src/content/blog.
//
// The "Blog post" GitHub workflow runs it every week and opens a pull request,
// so nothing gets published until that PR is reviewed and merged.
//
// Locally: put GEMINI_API_KEY in .env (https://aistudio.google.com/apikey), then
//   npm run blog:generate                      next idea from topics.md, or Gemini picks
//   npm run blog:generate -- "Your topic"      a specific topic
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, appendFileSync } from "node:fs";
import "../load-env.mjs";

const BLOG_DIR = "src/content/blog";
const PERSONA_FILE = "scripts/blog/persona.md";
const TOPICS_FILE = "scripts/blog/topics.md";

// Tried in order: a model can be retired or rate limited, the next one takes over.
// GEMINI_MODEL (a repository variable in GitHub) goes first when set.
const MODELS = [process.env.GEMINI_MODEL, "gemini-3.8-flash", "gemini-3.5-flash", "gemini-2.5-flash"]
    .filter((model, i, all) => model && all.indexOf(model) === i);

const MIN_WORDS = 600;

// Filler that makes a post sound machine-written. Listed in the prompt, and
// flagged in the pull request if any slips through
const BANNED_PHRASES = [
    "magic", "magical", "seamless", "seamlessly", "elevate", "elevating", "game-changer", "game changer",
    "supercharge", "unlock", "unleash", "delve", "dive into", "deep dive", "in today's", "fast-paced",
    "feels premium", "literally", "state-of-the-art", "cutting-edge", "effortless", "effortlessly",
    "revolutionize", "harness the power", "look no further", "buckle up", "without further ado",
];
const ATTEMPTS = 2;

const { GEMINI_API_KEY: apiKey } = process.env;

if (!apiKey) {
    console.error("Missing GEMINI_API_KEY (in .env locally, or as a repository secret in GitHub)");
    process.exit(1);
}

// --- What's already there ---------------------------------------------------

const frontmatterField = (source, field) => {
    const value = source.match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1].trim();
    if (!value) return undefined;
    try {
        return JSON.parse(value);
    } catch {
        return value.replace(/^["']|["']$/g, "");
    }
};

mkdirSync(BLOG_DIR, { recursive: true });

const existing = readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => {
        const source = readFileSync(`${BLOG_DIR}/${file}`, "utf8");
        return { title: frontmatterField(source, "title"), tags: frontmatterField(source, "tags") ?? [] };
    });

const knownTags = [...new Set(existing.flatMap((post) => (Array.isArray(post.tags) ? post.tags : [])))];

// --- Topic: CLI argument / workflow input > queue > Gemini's choice ----------

function nextQueuedTopic() {
    if (!existsSync(TOPICS_FILE)) return undefined;

    const source = readFileSync(TOPICS_FILE, "utf8");
    const match = source.match(/^- \[ \] (.+)$/m);
    if (!match) return undefined;

    return {
        topic: match[1].trim(),
        // Ticked only once the post is saved
        markDone: () => writeFileSync(TOPICS_FILE, source.replace(match[0], `- [x] ${match[1]}`)),
    };
}

const requested = (process.argv[2] ?? process.env.BLOG_TOPIC ?? "").trim();
const queued = requested ? undefined : nextQueuedTopic();
const topic = requested || queued?.topic;

// --- Prompt -------------------------------------------------------------------

const systemInstruction = `${readFileSync(PERSONA_FILE, "utf8")}

# Rules for every post

- Write in English, in Markdown. Do not include a top-level "# " heading: the title is rendered separately.
- Structure with "## " sections (and "### " when useful): a short intro, 3 to 6 sections, and a brief wrap-up.
- Length: ${MIN_WORDS} to 1200 words.
- Title and headings in sentence case ("Morphing cards in Astro", not "Morphing Cards In Astro").
- Code blocks must declare their language (\`\`\`ts, \`\`\`astro, \`\`\`css, \`\`\`html...) and be correct for the current versions of the tools.
- Inline code (single backticks) must never contain a backtick. For template literals or anything with backticks, use a code block or double backticks (\`\` \`a-\${id}\` \`\`).
- Code examples must follow the post's own advice; never recommend one thing and show another.
- Only explain how a tool works internally (what it compiles to, how the browser implements it) when you are certain. If you are not sure an API or feature exists, leave it out.
- Never invent personal stories, clients, numbers, benchmarks, quotes or links. The only personal experiences you may mention are the ones listed under "Things I've run into", and only when they are relevant.
- Sound like a person talking to a teammate: no hype, no filler openings, no rhetorical question to start the post. Never use these words or phrases: ${BANNED_PHRASES.join(", ")}.
- The description is one or two sentences (max 160 characters) that make someone want to read the post.
- Tags: 1 to 3 short tags in Title Case. Reuse existing tags when they fit: ${knownTags.join(", ") || "(none yet)"}.`;

const prompt = [
    topic
        ? `Write a blog post about: ${topic}`
        : "Pick a fresh, specific and practical topic that fits the author and write a blog post about it.",
    existing.length > 0 &&
        `These posts already exist; do not repeat them or overlap too much:\n${existing.map((post) => `- ${post.title}`).join("\n")}`,
    `Today is ${new Date().toISOString().slice(0, 10)}.`,
].filter(Boolean).join("\n\n");

const responseSchema = {
    type: "OBJECT",
    properties: {
        title: { type: "STRING", description: "Specific, catchy title, max 70 characters, no trailing period" },
        description: { type: "STRING" },
        tags: { type: "ARRAY", items: { type: "STRING" } },
        body: { type: "STRING", description: "The post in Markdown, without the title" },
    },
    required: ["title", "description", "tags", "body"],
    propertyOrdering: ["title", "description", "tags", "body"],
};

// --- Gemini ---------------------------------------------------------------------

async function generate(model) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.9,
                responseMimeType: "application/json",
                responseSchema,
            },
        }),
    });

    if (!response.ok) {
        const error = new Error(`${model}: ${response.status} ${(await response.text()).slice(0, 300)}`);
        error.status = response.status;
        throw error;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("");
    if (!text) throw new Error(`${model}: empty response (${data.candidates?.[0]?.finishReason ?? "no candidates"})`);

    return JSON.parse(text);
}

function clean(post) {
    const body = post.body
        .trim()
        // Just in case: drop a leading "# Title"
        .replace(/^#\s+.+\n+/, "");

    return {
        title: post.title.trim().replace(/\.$/, ""),
        description: post.description.trim(),
        tags: [...new Set(post.tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 3),
        body,
    };
}

function problems(post) {
    const words = post.body.split(/\s+/).filter(Boolean).length;

    return [
        (post.title.length < 10 || post.title.length > 90) && `title length ${post.title.length}`,
        (post.description.length < 40 || post.description.length > 220) && `description length ${post.description.length}`,
        post.tags.length === 0 && "no tags",
        words < MIN_WORDS && `only ${words} words`,
        !/^## /m.test(post.body) && "no sections",
        existing.some((other) => other.title?.toLowerCase() === post.title.toLowerCase()) && "duplicate title",
        brokenInlineCode(post.body) && "broken inline code",
    ].filter(Boolean);
}

// A template literal inside single backticks splits the inline code in pieces:
// `transition:name={` image-${id} `}`. Those pieces end with an opening
// bracket, start with a closing one or wrap across lines
function brokenInlineCode(body) {
    const prose = body.replace(/^```[\s\S]*?^```/gm, "");
    const spans = [...prose.matchAll(/(?<!`)`(?!`)([^`]+)`(?!`)/g)].map((match) => match[1]);

    return (
        spans.some((code) => code.includes("\n") || /[{([=]\s*$/.test(code) || /^\s*[})\]]/.test(code)) ||
        // An odd number of backticks in a paragraph: a span was left open
        prose.split(/\n\s*\n/).some((paragraph) => (paragraph.match(/`/g)?.length ?? 0) % 2 === 1)
    );
}

// Not worth another attempt, but worth a look in the pull request
function warnings(post) {
    const text = `${post.title} ${post.description} ${post.body.replace(/^```[\s\S]*?^```/gm, "")}`.toLowerCase();
    const phrases = BANNED_PHRASES.filter((phrase) => new RegExp(`\\b${phrase}\\b`).test(text));

    return phrases.length > 0 ? [`Filler phrases to reword: ${phrases.map((phrase) => `"${phrase}"`).join(", ")}`] : [];
}

async function draft() {
    const errors = [];

    for (const model of MODELS) {
        for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
            try {
                const post = clean(await generate(model));
                const issues = problems(post);
                if (issues.length === 0) return { post, model };

                errors.push(`${model} (attempt ${attempt}): ${issues.join(", ")}`);
            } catch (error) {
                errors.push(error.message);
                // Model retired, rate limited or overloaded: move on to the next one.
                // Anything else (a malformed answer) gets another attempt
                if (error.status) break;
            }
        }
    }

    throw new Error(`Could not draft a post:\n- ${errors.join("\n- ")}`);
}

// --- Save -------------------------------------------------------------------------

function slugify(text) {
    const slug = text
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    // Long titles are cut at the last whole word
    return slug.length <= 60 ? slug : slug.slice(0, 60).replace(/-[^-]*$/, "");
}

function freeSlug(base) {
    let slug = base;
    for (let n = 2; existsSync(`${BLOG_DIR}/${slug}.md`); n++) slug = `${base}-${n}`;
    return slug;
}

console.log(topic ? `Topic: ${topic}` : "Topic: Gemini's choice");

const { post, model } = await draft();
const slug = freeSlug(slugify(post.title));
const file = `${BLOG_DIR}/${slug}.md`;

// JSON strings are valid YAML, so titles with quotes or colons are safe
const markdown = `---
title: ${JSON.stringify(post.title)}
description: ${JSON.stringify(post.description)}
pubDate: ${new Date().toISOString().slice(0, 10)}
tags: ${JSON.stringify(post.tags)}
ai: true
---

${post.body}
`;

writeFileSync(file, markdown);
queued?.markDone();

console.log(`Saved ${file} (${model}): "${post.title}"`);

const notes = warnings(post);
notes.forEach((note) => console.warn(`Heads up: ${note}`));

// Picked up by the workflow to name the branch and the pull request
if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, [
        `slug=${slug}`,
        `file=${file}`,
        `model=${model}`,
        `title=${post.title.replace(/\r?\n/g, " ")}`,
        `topic=${(topic ?? "Picked by Gemini").replace(/\r?\n/g, " ")}`,
        // Multiline value: shown as a list in the pull request
        "notes<<NOTES",
        ...(notes.length > 0 ? notes.map((note) => `- ⚠️ ${note}`) : ["- Nothing flagged by the automatic checks"]),
        "NOTES",
        "",
    ].join("\n"));
}
