const BRASS = "#9a7b4f";

export const EyebrowComponent = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
        <span className="w-1.5 h-1.5" style={{ background: BRASS }} />
        {children}
    </span>
)