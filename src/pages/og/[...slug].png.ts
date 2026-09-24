// Branded Open Graph images (1200×630), generated at build time.
// /og/index.png, /og/about.png, /og/projects/<slug>.png, …
import type { APIRoute, GetStaticPaths, ImageMetadata } from "astro";
import { readFile } from "node:fs/promises";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

import { getProjects } from "@/data/projects";
import { featuredSkills } from "@/data/skills";

interface OgPage {
    eyebrow: string;
    title: string;
    description: string;
    tags: string[];
    // Absolute path to a screenshot shown on the right
    cover?: string;
    // Name in the bottom-right corner (off when the title already is the name)
    signature?: boolean;
}

// Astro keeps each image's file path in a non-enumerable `fsPath` property.
// It isn't in the public types; if it ever goes away, the image is just
// rendered without the screenshot.
const sourcePath = (image?: ImageMetadata) => (image as (ImageMetadata & { fsPath?: string }) | undefined)?.fsPath;

const CATEGORY = { landing: "Landing page", app: "Web app", ecommerce: "Ecommerce" } as const;

export const getStaticPaths = (async () => {
    const projects = await getProjects();
    const topSkills = featuredSkills[0].map((skill) => skill.name);

    const pages: { slug: string; page: OgPage }[] = [
        {
            slug: "index",
            page: {
                eyebrow: "Frontend Developer",
                title: "Carlos Maza",
                description: "Building fast, thoughtful web experiences from Barranquilla, Colombia.",
                tags: topSkills,
                signature: false,
            },
        },
        {
            slug: "about",
            page: {
                eyebrow: "About",
                title: "The long version",
                description: "From planning to study Accounting to becoming a frontend developer, almost by accident.",
                tags: ["Barranquilla, CO", "Frontend", "Per aspera ad astra"],
            },
        },
        {
            slug: "projects",
            page: {
                eyebrow: "Projects",
                title: "Things I've built",
                description: "Products and platforms from landing pages to full apps and ecommerce sites.",
                tags: ["Landings", "Apps", "Ecommerce"],
            },
        },
        {
            slug: "skills",
            page: {
                eyebrow: "Skills",
                title: "My toolbox",
                description: "Technologies and tools I use day-to-day, from frontend frameworks to AI-assisted workflows.",
                tags: featuredSkills.flat().slice(0, 6).map((skill) => skill.name),
            },
        },
        ...projects.map(({ id, data }) => ({
            slug: `projects/${id}`,
            page: {
                eyebrow: CATEGORY[data.category],
                title: data.name,
                description: data.description,
                tags: data.stack,
                cover: sourcePath(data.images[0]),
            },
        })),
    ];

    return pages.map(({ slug, page }) => ({ params: { slug }, props: { page } }));
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

async function render({ eyebrow, title, description, tags, cover, signature = true }: OgPage) {
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
                el("span", { fontSize: image ? 72 : 88, fontWeight: 700, lineHeight: 1.05 }, title),
                description && el("span", {
                    fontSize: 28,
                    lineHeight: 1.4,
                    color: "rgba(255, 255, 255, 0.7)",
                }, description),
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
