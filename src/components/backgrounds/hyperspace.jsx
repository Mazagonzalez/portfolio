import { useEffect, useRef } from 'react';
import { createStarfield } from './starfield';

export default function Hyperspace() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const starfield = createStarfield(container, canvasRef.current);

        const onEnter = () => starfield.warp(true);
        const onLeave = () => starfield.warp(false);

        container.addEventListener('pointerenter', onEnter);
        container.addEventListener('pointerleave', onLeave);

        return () => {
            starfield.destroy();
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
