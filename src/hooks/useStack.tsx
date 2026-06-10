import { useEffect, useRef, useState } from "react";

export const useStuck = (offsetTop: number) => {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [isStuck, setIsStuck] = useState(false);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsStuck(!entry.isIntersecting),
            {
                // сдвигаем "линию пересечения" вниз на высоту хедера:
                // сентинел считается ушедшим, когда он скрылся ПОД хедером
                rootMargin: `-${offsetTop + 1}px 0px 0px 0px`,
                threshold: 0,
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [offsetTop]);

    return { sentinelRef, isStuck };
};