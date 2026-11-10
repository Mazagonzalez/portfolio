// Elements with the .rv class fade in (and un-blur) when they scroll into view.
// The hidden state only exists in CSS when scripting is on (see components.css),
// so without JavaScript everything is simply visible.
const observer = new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
        }
    },
    { rootMargin: "0px 0px -8% 0px" },
);

function observeAll() {
    document.querySelectorAll(".rv:not(.in)").forEach((element) => observer.observe(element));
}

// Once now (the first page-load event may have fired already) and after every navigation
observeAll();
document.addEventListener("astro:page-load", observeAll);
