import { motion } from "framer-motion"
import { Brand } from ".."

export const AuthShellComponent = ({
    children,
    switchNode,
}: {
    children: React.ReactNode
    switchNode?: React.ReactNode
}) => (
    <div className="w-full flex justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
                <Brand />
                {switchNode}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="rounded-2xl border border-black/10 bg-white/60 backdrop-blur-sm p-6 sm:p-7"
            >
                {children}
            </motion.div>

            <p className="text-center text-[10px] font-mono uppercase tracking-wider text-zinc-400 mt-5">
                © 2026 Свет.Ру
            </p>
        </div>
    </div>
)