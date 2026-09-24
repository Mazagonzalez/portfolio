// Canvas starfield shared by the Hyperspace card and the Konami easter egg.
// Stars fly toward the viewer; warp() speeds them up into light streaks.

interface StarfieldOptions {
    starCount?: number;
    idleSpeed?: number;
    warpSpeed?: number;
}

interface Star {
    x: number;
    y: number;
    z: number;
    pz: number;
}

export function createStarfield(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    { starCount = 400, idleSpeed = 0.4, warpSpeed = 22 }: StarfieldOptions = {},
) {
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let speed = idleSpeed;
    let targetSpeed = idleSpeed;
    let animId = 0;
    let onScreen = false;

    function makeStar(): Star {
        const z = Math.random() * width;
        return {
            x: (Math.random() - 0.5) * width,
            y: (Math.random() - 0.5) * height,
            z,
            pz: z,
        };
    }

    function resize() {
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
        speed += (targetSpeed - speed) * 0.06;

        ctx.fillStyle = "rgba(6, 6, 10, 0.55)";
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        for (const star of stars) {
            star.pz = star.z;
            star.z -= speed;

            if (star.z <= 1) {
                Object.assign(star, makeStar(), { z: width, pz: width });
            }

            const sx = cx + (star.x / star.z) * width;
            const sy = cy + (star.y / star.z) * height;
            const px = cx + (star.x / star.pz) * width;
            const py = cy + (star.y / star.pz) * height;

            const depth = 1 - star.z / width;

            ctx.strokeStyle = `rgba(210, 218, 255, ${Math.min(1, depth * 1.5)})`;
            ctx.lineWidth = Math.max(0.4, depth * 2.4);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        }
    }

    function frame() {
        animId = requestAnimationFrame(frame);
        draw();
    }

    // Animate only while on screen, the tab is visible and motion is
    // allowed; otherwise keep a still starfield
    function sync() {
        const shouldAnimate = onScreen && !document.hidden && !reducedMotion.matches;
        if (shouldAnimate && !animId) {
            animId = requestAnimationFrame(frame);
        } else if (!shouldAnimate && animId) {
            cancelAnimationFrame(animId);
            animId = 0;
        }
    }

    const observer = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
    });

    observer.observe(container);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);

    resize();
    stars = Array.from({ length: starCount }, makeStar);
    draw();

    return {
        warp(on: boolean) {
            targetSpeed = on && !reducedMotion.matches ? warpSpeed : idleSpeed;
        },
        destroy() {
            cancelAnimationFrame(animId);
            observer.disconnect();
            window.removeEventListener("resize", resize);
            document.removeEventListener("visibilitychange", sync);
            reducedMotion.removeEventListener("change", sync);
        },
    };
}
