import Link from "next/link";

export const SwitchLinkComponent = ({ text, label, href }: { text: string; label: string; href: string }) => (
    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
        {text}{" "}
        <Link
            href={href}
            className="text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-[#9a7b4f] hover:border-[#9a7b4f] transition-colors"
        >
            {label}
        </Link>
    </span>
)