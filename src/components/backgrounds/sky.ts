// Fixed star sky behind the whole site. Stars twinkle, drift a little as the
// page scrolls (nearer ones move more) and warp() stretches them into light
// streaks, like a jump to hyperspace.

interface Star {
    x: number;
    y: number;
    /** Depth: 0 is far and dim, 1 is near and bright */
    z: number;
    radius: number;
    phase: number;
    speed: number;
}

export interface Sky {
    warp(on: boolean): void;
    destroy(): void;
}

const TAU = Math.PI * 2;

export function createSky(canvas: HTMLCanvasElement): Sky {
    const ctx = canvas.getContext("2d")!;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let warpAmount = 0;
    let warpTarget = 0;
    let animId = 0;
    let last = performance.now();

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.round(Math.min(820, Math.max(260, (width * height) / 2100)));
        stars = Array.from({ length: count }, () => {
            const z = Math.random() ** 2.3;
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                z,
                radius: 0.35 + z * 1.15,
                phase: Math.random() * TAU,
                speed: 0.4 + Math.random() * 1.5,
            };
        });
        draw(performance.now(), 0);
    }

    function draw(now: number, dt: number) {
        ctx.clearRect(0, 0, width, height);
        warpAmount += (warpTarget - warpAmount) * Math.min(1, dt * 5);

        const t = now / 1000;
        const scroll = window.scrollY;
        const cx = width / 2;
        const cy = height / 2;
        const far = Math.max(width, height);
        const twinkle = !reducedMotion.matches;

        for (const star of stars) {
            // Wrap vertically so the sky never runs out while scrolling
            let y = (star.y - scroll * (0.03 + star.z * 0.15)) % height;
            if (y < 0) y += height;

            const x = star.x;
            const alpha = (0.25 + 0.75 * star.z) * (twinkle ? 0.75 + 0.25 * Math.sin(t * star.speed + star.phase) : 1);

            if (warpAmount > 0.012) {
                const dx = x - cx;
                const dy = y - cy;
                const dist = Math.hypot(dx, dy) || 1;
                const length = warpAmount * (16 + star.z * 320) * ((dist / far) * 2 + 0.12);

                ctx.strokeStyle = `rgba(214, 236, 255, ${alpha})`;
                ctx.lineWidth = star.radius;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + (dx / dist) * length, y + (dy / dist) * length);
                ctx.stroke();
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                if (star.radius < 0.9) {
                    ctx.fillRect(x, y, star.radius * 1.4, star.radius * 1.4);
                } else {
                    ctx.beginPath();
                    ctx.arc(x, y, star.radius, 0, TAU);
                    ctx.fill();
                }
            }
        }
    }

    function frame(now: number) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        draw(now, dt);
        animId = requestAnimationFrame(frame);
    }

    // Animate only while the tab is visible; with reduced motion the sky
    // stays still (and redraws on scroll so the parallax still works)
    function sync() {
        const animate = !document.hidden && !reducedMotion.matches;
        if (animate && !animId) {
            last = performance.now();
            animId = requestAnimationFrame(frame);
        } else if (!animate && animId) {
            cancelAnimationFrame(animId);
            animId = 0;
        }
    }

    const redraw = () => {
        if (!animId) draw(performance.now(), 0);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", redraw, { passive: true });
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);

    resize();
    sync();

    return {
        warp(on) {
            warpTarget = on && !reducedMotion.matches ? 1 : 0;
        },
        destroy() {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("scroll", redraw);
            document.removeEventListener("visibilitychange", sync);
            reducedMotion.removeEventListener("change", sync);
        },
    };
}
