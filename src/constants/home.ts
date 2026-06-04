/* Social Media */
import IconLinkedin from "@/components/icons/icon-linkedin.astro";
import IconGithub from "@/components/icons/icon-github.astro";
import IconInstagram from "@/components/icons/icon-instagram.astro";
import IconEmail from "@/components/icons/icon-email.astro";

/* Skills */
import IconLaravel from "@/components/icons/skills/icon-laravel.astro";
import IconAstro from "@/components/icons/skills/icon-astro.astro";
import IconReact from "@/components/icons/skills/icon-react.astro";
import IconJs from "@/components/icons/skills/icon-js.astro";
import IconTailwind from "@/components/icons/skills/icon-tailwind.astro";
import IconScss from "@/components/icons/skills/icon-scss.astro";
import IconCss from "@/components/icons/skills/icon-css.astro";
import IconHtml from "@/components/icons/skills/icon-html.astro";
import IconBootstrap from "@/components/icons/skills/icon-bootstrap.astro";
import IconGithubSkills from "@/components/icons/skills/icon-github.astro";
import IconGit from "@/components/icons/skills/icon-git.astro";
import IconSublime from "@/components/icons/skills/icon-sublime.astro";

export const iconsHero = [
    {
        url: 'https://github.com/Mazagonzalez',
        icon: IconGithub,
        target: true
    },
    {
        url: 'https://www.linkedin.com/in/carlos-arturo-maza-gonzalez-254b70249',
        icon: IconLinkedin,
        target: true
    },
    {
        url: 'https://www.instagram.com/carlosmaza_17/',
        icon: IconInstagram,
        target: true
    },
    {
        url: 'mailto:mazagonzalez61@gmail.com',
        icon: IconEmail,
        target: false
    },
]

export const jobsInformation = [
    {
        logo: "/images/openbox.jpg",
        company: "OpenBox",
        role: "Web Developer",
        period: "2025 - Present",
    },
    {
        logo: "/images/subito.jpg",
        company: "Súbito",
        role: "Web Developer",
        period: "2025 - Present",
    },
    {
        logo: "/images/efinti.jpg",
        company: "Efinti Holldings LLC",
        role: "Main Developer Frontend",
        period: "2025 - 2026",
    },
    {
        logo: "/images/coresoft.jpg",
        company: "Core Soft S.A.S",
        role: "Frontend Developer",
        period: "2024 - 2025",
    },
    {
        logo: "/images/coresoft.jpg",
        company: "Core Soft S.A.S",
        role: "Junior Developer",
        period: "2023 - 2024",
    }
]

export const iconsSkills = [
    {
        position: 0,
        icon: IconLaravel,
        color: 'hover:border-red-400/20!'
    },
    {
        position: 0,
        icon: IconAstro,
        color: 'hover:border-orange-400/20!'
    },
    {
        position: 0,
        icon: IconReact,
        color: 'hover:border-cyan-300/20!'
    },
    {
        position: 0,
        icon: IconJs,
        color: 'hover:border-yellow-400/20!'
    },
    {
        position: 1,
        icon: IconTailwind,
        color: 'hover:border-sky-300/20!'
    },
    {
        position: 1,
        icon: IconBootstrap,
        color: 'hover:border-purple-400/30!'
    },
    {
        position: 1,
        icon: IconScss,
        color: 'hover:border-pink-300/20!'
    },
    {
        position: 1,
        icon: IconCss,
        color: 'hover:border-blue-400/20!'
    },
    {
        position: 1,
        icon: IconHtml,
        color: 'hover:border-orange-400/20!'
    },
    {
        position: 2,
        icon: IconGithubSkills,
        color: 'hover:border-white/20!'
    },
    {
        position: 2,
        icon: IconGit,
        color: 'hover:border-orange-400/20!'
    },
    {
        position: 2,
        icon: IconSublime,
        color: 'hover:border-cyan-400/20!'
    }
]

export const projects = [
    {
        name: "RoofPixel",
        description: "Plataforma de medición de techos con render en tiempo real.",
        url: "https://roofpixel.co",
        stack: ["React", "Tailwind", "Astro"],
    },
    {
        name: "Súbito",
        description: "App de delivery con tracking de pedidos en vivo.",
        url: "https://subito.app",
        stack: ["React", "Laravel", "Scss"],
    },
    {
        name: "OpenBox",
        description: "Dashboard de analítica e inventario para e-commerce.",
        url: "https://openbox.io",
        stack: ["Astro", "Tailwind", "Js"],
    },
    {
        name: "Efinti Pay",
        description: "Pasarela de pagos con panel administrativo y reportes.",
        url: "https://efinti.com",
        stack: ["React", "Tailwind", "Laravel"],
    },
];

export const TRACKS = [
    {
        title: "Nunca Lo Olvides",
        artist: "Airbag",
        src: "/music/nunca-lo-olvides.mp3",
        cover: "/images/music/airbag.jpg",
    },
    {
        title: "Moscow Mule",
        artist: "Bad Bunny",
        src: "/music/moscow-mule.mp3",
        cover: "/images/music/bad-bunny.jpeg",
    },
    {
        title: "Til Further Notice",
        artist: "Travis Scott",
        src: "/music/til-further-notice.mp3",
        cover: "/images/music/travis-scott.jpeg",
    },
    {
        title: "Golden Gun",
        artist: "Alvaro Diaz",
        src: "/music/golden-gun.mp3",
        cover: "/images/music/alvaro-diaz.jpeg",
    },
    {
        title: "Carita Linda",
        artist: "Rauw Alejandro",
        src: "/music/carita-linda.mp3",
        cover: "/images/music/rauw-alejandro.jpeg",
    },
];