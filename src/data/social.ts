import IconGithub from "@/components/icons/icon-github.astro";
import IconLinkedin from "@/components/icons/icon-linkedin.astro";
import IconInstagram from "@/components/icons/icon-instagram.astro";
import IconEmail from "@/components/icons/icon-email.astro";

export const email = 'mazagonzalez61@gmail.com';

export const socialLinks = [
    {
        url: 'https://github.com/Mazagonzalez',
        label: 'GitHub',
        icon: IconGithub,
        target: true
    },
    {
        url: 'https://www.linkedin.com/in/carlos-arturo-maza-gonzalez',
        label: 'LinkedIn',
        icon: IconLinkedin,
        target: true
    },
    {
        url: 'https://www.instagram.com/carlosmaza_17/',
        label: 'Instagram',
        icon: IconInstagram,
        target: true
    },
    {
        url: `mailto:${email}`,
        label: 'Email',
        icon: IconEmail,
        target: false
    },
];
