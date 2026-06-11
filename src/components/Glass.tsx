'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

type LiquidGlassProps = {
    children: ReactNode;
    className?: string;
    radius?: number;     // скругление, px
    strength?: number;   // сила преломления (60–160)
    edge?: number;       // толщина преломляющей кромки, px
    dispersion?: number;
};

export const Glass = ({
    children,
    className = '',
    radius = 28,
    strength = 110,
    edge = 18,
    dispersion = 0.08,
    ...props
}: LiquidGlassProps) => {
    const id = useId().replace(/:/g, '');
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [mapUrl, setMapUrl] = useState('');

    // следим за размером элемента
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ w: Math.round(width), h: Math.round(height) });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // генерируем карту смещения под текущий размер
    // генерируем карту смещения под текущий размер
    useEffect(() => {
        const { w, h } = size;
        if (!w || !h) return;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;

        // КРАСНЫЙ канал: смещение по X, 0..255 слева направо
        const gx = ctx.createLinearGradient(0, 0, w, 0);
        gx.addColorStop(0, 'rgb(0,0,0)');
        gx.addColorStop(1, 'rgb(255,0,0)');
        ctx.fillStyle = gx;
        ctx.fillRect(0, 0, w, h);

        // ЗЕЛЁНЫЙ канал: смещение по Y, 0..255 сверху вниз — складываем аддитивно
        ctx.globalCompositeOperation = 'lighter';
        const gy = ctx.createLinearGradient(0, 0, 0, h);
        gy.addColorStop(0, 'rgb(0,0,0)');
        gy.addColorStop(1, 'rgb(0,255,0)');
        ctx.fillStyle = gy;
        ctx.fillRect(0, 0, w, h);

        // ЦЕНТР: честная нейтраль R=127, G=127 — ноль смещения,
        // с мягким переходом к кромке
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = `blur(${Math.max(2, edge / 3)}px)`; // размываем границу зоны
        ctx.fillStyle = 'rgb(127,127,0)';
        roundRect(ctx, edge, edge, w - edge * 2, h - edge * 2, Math.max(0, radius - edge));
        ctx.fill();
        ctx.filter = 'none';

        setMapUrl(canvas.toDataURL());
    }, [size, radius, edge]);

    const supportsRefraction =
        typeof CSS !== 'undefined' &&
        CSS.supports('backdrop-filter', `url(#x)`);

    return (
        <div
            ref={ref}
            className={`relative overflow-hidden ${className} ${props}`}
            style={{
                backdropFilter: supportsRefraction && mapUrl
                    ? `url(#${id}) blur(1.5px) saturate(1.5)`
                    : 'blur(16px) saturate(1.6)', // фолбэк: Safari/Firefox
                WebkitBackdropFilter: 'blur(16px) saturate(1.6)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
                boxShadow: `
                    inset 0 1px 1px rgba(255,255,255,0.7),
                    inset 0 -1px 1px rgba(0,0,0,0.08),
                    0 12px 40px rgba(0,0,0,0.18)
                `,
                border: '1px solid rgba(255,255,255,0.35)',
            }}
        >
            {/* SVG-фильтр преломления */}
            {mapUrl && (
                <svg className="absolute w-0 h-0" aria-hidden>
                    <filter id={id} x="0" y="0" width="100%" height="100%"
                        filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                        <feImage href={mapUrl} x="0" y="0" width={size.w} height={size.h} result="map" />

                        {/* КРАСНЫЙ канал — преломляем слабее */}
                        <feDisplacementMap in="SourceGraphic" in2="map"
                            scale={strength * (1 - dispersion)}
                            xChannelSelector="R" yChannelSelector="G" result="dispR" />
                        <feColorMatrix in="dispR" result="onlyR" type="matrix"
                            values="1 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0" />

                        {/* ЗЕЛЁНЫЙ канал — базовая сила */}
                        <feDisplacementMap in="SourceGraphic" in2="map"
                            scale={strength}
                            xChannelSelector="R" yChannelSelector="G" result="dispG" />
                        <feColorMatrix in="dispG" result="onlyG" type="matrix"
                            values="0 0 0 0 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0" />

                        {/* СИНИЙ канал — преломляем сильнее */}
                        <feDisplacementMap in="SourceGraphic" in2="map"
                            scale={strength * (1 + dispersion)}
                            xChannelSelector="R" yChannelSelector="G" result="dispB" />
                        <feColorMatrix in="dispB" result="onlyB" type="matrix"
                            values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0" />

                        {/* Складываем каналы обратно (аддитивно) */}
                        <feComposite in="onlyR" in2="onlyG" operator="arithmetic"
                            k1="0" k2="1" k3="1" k4="0" result="rg" />
                        <feComposite in="rg" in2="onlyB" operator="arithmetic"
                            k1="0" k2="1" k3="1" k4="0" />
                    </filter>
                </svg>
            )}

            {/* блик линзы */}
            <span aria-hidden className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 70% 35% at 50% -5%, rgba(255,255,255,0.4), transparent 60%)' }} />

            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
};

// хелпер: скруглённый прямоугольник
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}