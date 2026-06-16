import { ArrowRight } from "lucide-react";

export const PrimaryButtonComponent = ({ children }: { children: React.ReactNode }) => (
    <button
        type="submit"
        className="group w-full bg-zinc-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-black transition-colors"
    >
        {children}
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
    </button>
)