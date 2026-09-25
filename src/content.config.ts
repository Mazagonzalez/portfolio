import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projects = defineCollection({
    // Files starting with "_" (like _template.md) are ignored
    loader: glob({ pattern: "[^_]*.md", base: "./src/content/projects" }),
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            category: z.enum(["landing", "app", "ecommerce"]),
            description: z.string().default(""),
            order: z.number(),
            year: z.number().optional(),
            role: z.string().optional(),
            url: z.url().optional(),
            repo: z.url().optional(),
            stack: z.array(z.string()),
            // First image is used as the cover and the Open Graph image
            images: z.array(image()).default([]),
        }),
});

const blog = defineCollection({
    loader: glob({ pattern: "[^_]*.md", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        // Shown in lists, the meta description and the Open Graph image
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        // Drafts are visible in `npm run dev` but never built
        draft: z.boolean().default(false),
        // Posts drafted by the Gemini workflow (scripts/blog) get a small label
        ai: z.boolean().default(false),
    }),
});

export const collections = { projects, blog };
