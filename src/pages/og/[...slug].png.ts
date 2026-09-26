// Branded Open Graph images (1200×630), generated at build time.
// /og/index.png, /og/about.png, /og/projects/<slug>.png, … and the Spanish
// ones under /og/es/ (texts translated with src/i18n, like the pages)
import type { APIRoute, GetStaticPaths, ImageMetadata } from "astro";
import { readFile } from "node:fs/promises";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

import { getProjects, categoryLabels } from "@/data/projects";
import { getPosts, getTags, formatDate } from "@/data/blog";
import { featuredSkills } from "@/data/skills";
import { useTranslations, defaultLocale, locales, type Locale } from "@/i18n";

interface OgPage {
    eyebrow: string;
    title: string;
    description: string;
    tags: string[];
    // Absolute path to a screenshot shown on the right
    cover?: string;
    // Name in the bottom-right corner (off when the title already is the name)
    signature?: boolean;
    // Smaller headline for long titles (blog posts)
    compact?: boolean;
}

// Astro keeps each image's file path in a non-enumerable `fsPath` property.
// It isn't in the public types; if it ever goes away, the image is just
// rendered without the screenshot.
const sourcePath = (image?: ImageMetadata) => (image as (ImageMetadata & { fsPath?: string }) | undefined)?.fsPath;

export const getStaticPaths = (async () => {
    const projects = await getProjects();
    const posts = await getPosts();
    const topSkills = featuredSkills[0].map((skill) => skill.name);

    // Every page in one language. Blog posts are written in English, so
    // their /es page reuses the English image
    const pagesIn = (locale: Locale): { slug: string; page: OgPage }[] => {
        const __ = useTranslations(locale);

        return [
            {
                slug: "index",
                page: {
                    eyebrow: __("Frontend Developer"),
                    title: "Carlos Maza",
                    description: __("Building fast, thoughtful web experiences from Barranquilla, Colombia."),
                    tags: topSkills,
                    signature: false,
                },
            },
            {
                slug: "about",
                page: {
                    eyebrow: __("About"),
                    title: __("The long version"),
                    description: __("From planning to study Accounting to becoming a frontend developer, almost by accident."),
                    tags: ["Barranquilla, CO", "Frontend", "Per aspera ad astra"],
                },
            },
            {
                slug: "projects",
                page: {
                    eyebrow: __("Projects"),
                    title: __("Things I've built"),
                    description: __("Products and platforms from landing pages to full apps and ecommerce sites."),
                    tags: ["Landings", "Apps", "Ecommerce"],
                },
            },
            {
                slug: "skills",
                page: {
                    eyebrow: __("Skills"),
                    title: __("My toolbox"),
                    description: __("Technologies and tools I use day-to-day, from frontend frameworks to AI-assisted workflows."),
                    tags: featuredSkills.flat().slice(0, 6).map((skill) => skill.name),
                },
            },
            {
                slug: "blog",
                page: {
                    eyebrow: "Blog",
                    title: __("Notes & write-ups"),
                    description: __("Frontend, the tools I use every day and the small details that make an interface feel finished."),
                    tags: getTags(posts).slice(0, 5),
                },
            },
            ...(locale === defaultLocale ? posts : []).map(({ id, data }) => ({
                slug: `blog/${id}`,
                page: {
                    eyebrow: `Blog · ${formatDate(data.pubDate)}`,
                    title: data.title,
                    description: data.description,
                    tags: data.tags,
                    compact: true,
                },
            })),
            ...projects.map(({ id, data }) => ({
                slug: `projects/${id}`,
                page: {
                    eyebrow: __(categoryLabels[data.category]),
                    title: data.name,
                    description: data.description && __(data.description),
                    tags: data.stack,
                    cover: sourcePath(data.images[0]),
                },
            })),
        ];
    };

    return locales.flatMap((locale) => {
        const prefix = locale === defaultLocale ? "" : `${locale}/`;
        return pagesIn(locale).map(({ slug, page }) => ({ params: { slug: `${prefix}${slug}` }, props: { page } }));
    });
}) satisfies GetStaticPaths;

// Minimal element helper: satori takes React-like { type, props } objects
type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, props = {}): Node => ({
    type,
    props: { style, children, ...props },
});

const fontFile = (weight: number) =>
    readFile(`node_modules/@fontsource/geist-sans/files/geist-sans-latin-${weight}-normal.woff`);

const fonts = Promise.all([400, 500, 700].map(async (weight) => ({
    name: "Geist",
    data: await fontFile(weight),
    weight: weight as 400 | 500 | 700,
    style: "normal" as const,
})));

// Long texts would push the footer out of the card
const truncate = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text;

const toDataUrl = (png: Buffer) => `data:image/png;base64,${png.toString("base64")}`;

// Blurred aurora glow in the site's colors, rendered once and reused
const auroraSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#0b0b0f"/>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="90"/></filter>
    <g filter="url(#blur)">
        <ellipse cx="120" cy="-40" rx="420" ry="260" fill="#7E57C7" opacity="0.9"/>
        <ellipse cx="640" cy="-80" rx="380" ry="200" fill="#1D93C2" opacity="0.7"/>
        <ellipse cx="1160" cy="-20" rx="360" ry="240" fill="#7453ED" opacity="0.85"/>
        <ellipse cx="1150" cy="680" rx="380" ry="200" fill="#7453ED" opacity="0.4"/>
    </g>
</svg>`;

const aurora = sharp(Buffer.from(auroraSvg)).png().toBuffer().then(toDataUrl);

async function coverDataUrl(path: string) {
    // Keep the top-left corner, where screenshots usually have the logo and headline
    const png = await sharp(path).resize(1120, 700, { fit: "cover", position: "left top" }).png().toBuffer();
    return toDataUrl(png);
}

async function render({ eyebrow, title, description, tags, cover, signature = true, compact = false }: OgPage) {
    const image = cover ? await coverDataUrl(cover) : undefined;
    const textWidth = image ? 560 : 960;

    const tree = el("div", {
        width: 1200,
        height: 630,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0b0b0f",
        fontFamily: "Geist",
        color: "white",
    }, [
        el("img", { position: "absolute", inset: 0, width: 1200, height: 630 }, undefined, { src: await aurora }),

        image && el("img", {
            position: "absolute",
            right: -60,
            top: 150,
            width: 560,
            height: 350,
            objectFit: "cover",
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6)",
        }, undefined, { src: image }),

        el("div", {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "64px 72px",
        }, [
            // Brand
            el("div", { display: "flex", alignItems: "center", gap: 16, fontSize: 26 }, [
                el("span", { fontWeight: 700, letterSpacing: 2 }, "AMG"),
                el("span", { width: 1, height: 26, backgroundColor: "rgba(255, 255, 255, 0.2)" }),
                el("span", { color: "rgba(255, 255, 255, 0.5)" }, "amg-devel.vercel.app"),
            ]),

            // Headline
            el("div", { display: "flex", flexDirection: "column", gap: 18, width: textWidth }, [
                el("span", {
                    fontSize: 22,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: 4,
                    color: "rgba(255, 255, 255, 0.55)",
                }, eyebrow),
                el("span", { fontSize: compact ? 60 : image ? 72 : 88, fontWeight: 700, lineHeight: 1.1 }, title),
                description && el("span", {
                    fontSize: 28,
                    lineHeight: 1.4,
                    color: "rgba(255, 255, 255, 0.7)",
                }, truncate(description, 150)),
            ]),

            // Footer: tags + name
            el("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
                el("div", { display: "flex", gap: 10, maxWidth: textWidth, flexWrap: "wrap" }, tags.slice(0, 5).map((tag) =>
                    el("span", {
                        padding: "8px 18px",
                        borderRadius: 999,
                        fontSize: 20,
                        color: "rgba(255, 255, 255, 0.75)",
                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                    }, tag),
                )),
                !image && signature && el("span", { fontSize: 22, flexShrink: 0, color: "rgba(255, 255, 255, 0.5)" }, "Carlos Maza"),
            ]),
        ]),
    ]);

    const svg = await satori(tree as never, { width: 1200, height: 630, fonts: await fonts });
    return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}

export const GET: APIRoute = async ({ props }) => {
    const png = await render(props.page as OgPage);

    return new Response(new Uint8Array(png), {
        headers: { "Content-Type": "image/png" },
    });
};
