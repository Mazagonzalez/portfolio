import { defineCollection, z } from "astro:content";
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
            url: z.string().url().optional(),
            repo: z.string().url().optional(),
            stack: z.array(z.string()),
            // First image is used as the cover and the Open Graph image
            images: z.array(image()).default([]),
        }),
});

export const collections = { projects };
