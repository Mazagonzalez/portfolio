import { getCollection } from "astro:content";

export async function getProjects() {
    const projects = await getCollection("projects");

    return projects.sort((a, b) => a.data.order - b.data.order);
}

// Shared view-transition names: the cover and title in the lists morph
// into the carousel and heading of the detail page
export function projectTransition(id: string) {
    return {
        cover: `project-cover-${id}`,
        title: `project-title-${id}`,
    };
}
