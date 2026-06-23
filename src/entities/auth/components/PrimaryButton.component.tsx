import { ArrowRight } from "lucide-react";

export const PrimaryButtonComponent = ({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) => (
    <button
        type="submit"
        disabled={disabled}
        className="group w-full bg-zinc-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
        {children}
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
    </button>
)