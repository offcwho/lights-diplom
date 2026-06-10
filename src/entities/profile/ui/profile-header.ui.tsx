import { LogOut } from "lucide-react"

export const ProfileHeaderUi = () => {
    return (
        <div className="flex items-center gap-3 pb-4 mb-2 md:mb-4 border-b border-black/10">
            <div className="w-10 h-10 shrink-0 bg-black text-white rounded-full flex items-center justify-center font-bold">A</div>
            <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold truncate">Александр Б.</h3>
                <p className="text-[10px] text-zinc-500 truncate">alex@luxf.design</p>
            </div>
            <button
                title="Выйти"
                aria-label="Выйти"
                className="shrink-0 p-2.5 rounded-xl text-zinc-400 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
                <LogOut size={16} />
            </button>
        </div>
    )
}