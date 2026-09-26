import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

// Newest first. Drafts only show up in `npm run dev`
export async function getPosts() {
    const posts = await getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft);

    return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

// getStaticPaths of /blog/<slug>, shared with /es/blog/<slug>.
// Posts are newest first: "newer" is the one before, "older" the one after
export async function getPostPaths() {
    const posts = await getPosts();

    return posts.map((post, i) => ({
        params: { slug: post.id },
        props: { post, newer: posts[i - 1], older: posts[i + 1] },
    }));
}

// Every tag with how many posts use it, most used first
export function getTags(posts: Post[]) {
    const counts = new Map<string, number>();
    posts.flatMap((post) => post.data.tags).forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));

    return [...counts].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
}

// ~220 words per minute, ignoring code blocks and markdown symbols
export function readingTime(body = "") {
    const words = body
        .replace(/```[\s\S]*?```/g, "")
        .replace(/[#>*_`[\]()-]/g, " ")
        .split(/\s+/)
        .filter(Boolean).length;

    return Math.max(1, Math.round(words / 220));
}

export const formatDate = (date: Date, locale = "en-US") =>
    date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

// The title in the list morphs into the heading of the post
export const postTransition = (id: string) => `post-title-${id}`;
