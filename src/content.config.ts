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

export const collections = { projects };
