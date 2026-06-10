import { Mail } from "lucide-react"

export const FooterUi = () => {
    return (
        <footer className="bg-[#111111] text-[#e3e3e3] pt-16 pb-12 rounded-t-[40px]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-black/10">

                {/* Инфо */}
                <div className="md:col-span-3 space-y-4">
                    <h3 className="text-xl font-black tracking-tight">luxf.light</h3>
                    <div className="flex space-x-3 text-zinc-700">
                        {/*
                        <Instagram size={18} className="hover:text-black cursor-pointer" />
                        <Facebook size={18} className="hover:text-black cursor-pointer" />
                        <Twitter size={18} className="hover:text-black cursor-pointer" />
                       */}
                    </div>
                </div>

                {/* Ссылки колонка 1 */}
                <div className="md:col-span-2 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Pendant</h4>
                    <ul className="text-sm space-y-2 text-zinc-600">
                        <li><a href="#" className="hover:underline">New Collection</a></li>
                        <li><a href="#" className="hover:underline">Concrete Series</a></li>
                        <li><a href="#" className="hover:underline">Minimalist Brass</a></li>
                    </ul>
                </div>

                {/* Ссылки колонка 2 */}
                <div className="md:col-span-2 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Company</h4>
                    <ul className="text-sm space-y-2 text-zinc-600">
                        <li><a href="#" className="hover:underline">About Us</a></li>
                        <li><a href="#" className="hover:underline">Showroom</a></li>
                        <li><a href="#" className="hover:underline">Contact</a></li>
                    </ul>
                </div>

                {/* Контакты */}
                <div className="md:col-span-2 space-y-2 text-xs text-zinc-600">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Contact</h4>
                    <p>+1 800 123 45 67</p>
                    <p>design@luxf.light</p>
                    <p>Dubai / House 42, Apt. 8</p>
                </div>

                {/* Подписка на рассылку (Newsletter) */}
                <div className="md:col-span-3 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">NEWSLETTER</h4>
                    <p className="text-xs text-zinc-600">Subscribe to receive updates, access to exclusive deals, and more.</p>
                    <div className="flex items-center border-b border-[#e3e3e3] py-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-transparent border-none w-full text-sm text-[#e3e3e3] placeholder-zinc-600 focus:outline-none"
                        />
                        <button className="text-black hover:translate-x-1 transition-transform">
                            <Mail size={16} />
                        </button>
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
                <p>© 2026 luxf.light. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms of Service</a>
                </div>
            </div>
        </footer>
    )
}