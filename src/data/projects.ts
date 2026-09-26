import { getCollection } from "astro:content";

export async function getProjects() {
    const projects = await getCollection("projects");

    return projects.sort((a, b) => a.data.order - b.data.order);
}

// getStaticPaths of /projects/<slug>, shared with /es/projects/<slug>
export async function getProjectPaths() {
    const projects = await getProjects();

    return projects.map((project) => ({
        params: { slug: project.id },
        props: { project },
    }));
}

// Labels for `category`, translated with __() where they are shown
export const categoryLabels = { landing: "Landing page", app: "Web app", ecommerce: "Ecommerce" } as const;

// Shared view-transition names: the cover and title in the lists morph
// into the carousel and heading of the detail page
export function projectTransition(id: string) {
    return {
        cover: `project-cover-${id}`,
        title: `project-title-${id}`,
    };
}
