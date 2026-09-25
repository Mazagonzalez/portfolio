import type { APIRoute } from "astro";
import rss from "@astrojs/rss";

import { getPosts } from "@/data/blog";

export const GET: APIRoute = async ({ site }) => {
    const posts = await getPosts();

    return rss({
        title: "AMG - devel blog",
        description: "Notes on frontend development by Carlos Maza.",
        site: site!,
        items: posts.map(({ id, data }) => ({
            title: data.title,
            description: data.description,
            pubDate: data.pubDate,
            categories: data.tags,
            link: `/blog/${id}`,
        })),
        customData: "<language>en-us</language>",
    });
};
