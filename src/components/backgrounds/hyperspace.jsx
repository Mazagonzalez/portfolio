import { useEffect, useRef } from 'react';

const STAR_COUNT = 400;
const IDLE_SPEED = 0.4;
const WARP_SPEED = 22;

export default function Hyperspace() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let width = 0;
        let height = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        let stars = [];
        let speed = IDLE_SPEED;
        let targetSpeed = IDLE_SPEED;

        function makeStar() {
            return {
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                z: Math.random() * width,
                pz: 0,
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

        function initStars() {
            stars = Array.from({ length: STAR_COUNT }, makeStar);
            stars.forEach((s) => {
                s.pz = s.z;
            });
        }

        function onEnter() {
            targetSpeed = WARP_SPEED;
        }

        function onLeave() {
            targetSpeed = IDLE_SPEED;
        }

        container.addEventListener('pointerenter', onEnter);
        container.addEventListener('pointerleave', onLeave);
        window.addEventListener('resize', resize);

        resize();
        initStars();

        let animId = 0;
        function frame() {
            animId = requestAnimationFrame(frame);

            speed += (targetSpeed - speed) * 0.06;

            ctx.fillStyle = 'rgba(6, 6, 10, 0.55)';
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            for (const star of stars) {
                star.pz = star.z;
                star.z -= speed;

                if (star.z <= 1) {
                    const fresh = makeStar();
                    star.x = fresh.x;
                    star.y = fresh.y;
                    star.z = width;
                    star.pz = width;
                }

                const sx = cx + (star.x / star.z) * width;
                const sy = cy + (star.y / star.z) * height;
                const px = cx + (star.x / star.pz) * width;
                const py = cy + (star.y / star.pz) * height;

                const depth = 1 - star.z / width;
                const size = Math.max(0.4, depth * 2.4);
                const opacity = Math.min(1, depth * 1.5);

                ctx.strokeStyle = `rgba(210, 218, 255, ${opacity})`;
                ctx.lineWidth = size;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();
            }
        }
        animId = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            container.removeEventListener('pointerenter', onEnter);
            container.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 bg-[#05050a]">
            <canvas ref={canvasRef} className="block" />
        </div>
    );
}
