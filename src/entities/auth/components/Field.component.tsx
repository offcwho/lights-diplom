type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string }
export const FieldComponent = ({ label, ...props }: FieldProps) => (
    <label className="block space-y-1.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-zinc-400">
            {label}
        </span>
        <input
            className="w-full bg-white border border-black/10 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none transition-colors focus:border-zinc-900"
            {...props}
        />
    </label>
)