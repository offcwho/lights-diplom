import { motion } from "framer-motion";

export const Toggle = ({ label, description, checked, onChange }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="w-full flex items-center justify-between gap-4 py-2.5 text-left group"
    >
        <div className="min-w-0">
            <span className="text-xs font-bold block">{label}</span>
            <span className="text-[10px] text-zinc-500">{description}</span>
        </div>
        <span className={`shrink-0 w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ${checked ? 'bg-black' : 'bg-zinc-300 group-hover:bg-zinc-400'}`}>
            <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                className={`block w-5 h-5 bg-white rounded-full shadow-sm ${checked ? 'ml-auto' : ''}`}
            />
        </span>
    </button>
);