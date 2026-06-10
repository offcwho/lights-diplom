import { Container } from "@/components/Container";
import { ArrowLeft, ArrowRight, Plus, Star } from "lucide-react"

interface Props {
    productId: string;
}

export const ProductUi: React.FC<Props> = ({ productId }) => {
    const recommendations = [
        { id: 2, name: 'YUN MINIMAL BRASS', price: '650.00$', tag: 'BRASS', img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=400' },
        { id: 3, name: 'TICK INDUSTRIAL FLOOR', price: '520.00$', tag: 'STEEL', img: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=400' },
    ];

    return (
        <div className="space-y-24 py-12 max-w-7xl mx-auto px-6 text-[#111111]">

            {/* --- ГЛАВНЫЙ ЭКРАН ТОВАРА --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                {/* Левая колонка: Галерея */}
                <div className="lg:col-span-6 relative top-6">
                    <div className="w-full aspect-4/5 rounded-4xl overflow-hidden bg-zinc-300 relative shadow-sm">
                        <img
                            src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop"
                            alt="Main Product"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-6 left-6 flex space-x-2">
                            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform">
                                <ArrowLeft size={16} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Правая колонка: Инфо, Покупка и Характеристики */}
                <div className="lg:col-span-6 space-y-10">
                    <div className="space-y-6">
                        <div>
                            <span className="text-xs uppercase font-bold tracking-[0.2em] text-zinc-500 block mb-2">The pendant lamp</span>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase">CONCRETE<br />LIGHTS</h1>

                            <div className="flex items-center justify-between border-t border-black/10 pt-4 mt-6">
                                <h2 className="text-xl font-bold text-zinc-800">Jasper Vintage Cement</h2>
                                <span className="text-2xl font-bold tracking-tight">650.00$</span>
                            </div>
                        </div>

                        <p className="text-sm text-zinc-600 leading-relaxed">
                            Минималистичный дизайн, вдохновленный необработанным бетоном и четкой геометрией сфер. Идеально подходит для создания мягкого акцентного освещения в интерьерах лофт и минимализм.
                        </p>

                        <div className="flex items-center space-x-4 pt-2">
                            <button className="bg-[#111111] text-white px-10 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-sm">
                                КУПИТЬ СЕЙЧАС
                            </button>
                        </div>
                    </div>

                    {/* ХАРАКТЕРИСТИКИ (Тонкая журнальная таблица) */}
                    <div className="pt-8 border-t border-black/10 space-y-4">
                        <h3 className="text-xs uppercase font-bold tracking-widest text-zinc-400">Спецификация объекта</h3>
                        <div className="text-xs divide-y divide-black/5 font-medium">
                            <div className="flex justify-between py-3">
                                <span className="text-zinc-500">Материал купола</span>
                                <span className="font-bold text-right">Архитектурный мелкозернистый бетон M500</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-zinc-500">Внутреннее напыление</span>
                                <span className="font-bold text-right">Матовая латунь / Шлифовка</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-zinc-500">Габариты купола</span>
                                <span className="font-bold text-right">Ø 240 мм × Высота 320 мм</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-zinc-500">Источник света</span>
                                <span className="font-bold text-right">LED-матрица COB (CRI &gt; 95), 2700K теплый свет</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-zinc-500">Длина кабеля</span>
                                <span className="font-bold text-right">1.5 м в текстильной черной оплетке</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-zinc-500">Вес нетто</span>
                                <span className="font-bold text-right">3.4 кг</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- ОТЗЫВЫ РЕЗИДЕНТОВ (Премиальные текстовые цитаты) --- */}
            <section className="pt-16 border-t border-black/10 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-400">Мнения</span>
                        <h2 className="text-3xl font-black uppercase tracking-tight mt-1">Опыт интеграции в интерьер</h2>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
                        <span className="text-zinc-500">Общая оценка резидентов:</span>
                        <span className="flex items-center bg-white px-3 py-1 rounded-full border border-black/5 shadow-sm">
                            4.9 <Star size={12} className="ml-1 fill-black text-black" />
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Отзыв 1 */}
                    <div className="bg-[#F5F4F1] p-8 rounded-3xl flex flex-col justify-between space-y-6">
                        <p className="text-sm text-zinc-800 italic leading-relaxed">
                            «Использовал три таких подвеса над кухонным островом в проекте ЖК Наследие. Качество литья поразило — пористость бетона распределена равномерно, нет грубых раковин. Нижний свет идеален: конус четкий, латунь внутри дает потрясающий уютный оттенок золота.»
                        </p>
                        <div className="flex justify-between items-center pt-4 border-t border-black/5 text-xs">
                            <div>
                                <h4 className="font-bold uppercase tracking-wide">Константин Ш.</h4>
                                <p className="text-zinc-500 mt-0.5">Ведущий архитектор K-Studio</p>
                            </div>
                            <span className="text-zinc-400 font-medium">12 Мая 2026</span>
                        </div>
                    </div>

                    {/* Отзыв 2 */}
                    <div className="bg-[#F5F4F1] p-8 rounded-3xl flex flex-col justify-between space-y-6">
                        <p className="text-sm text-zinc-800 italic leading-relaxed">
                            «Искала светильник, который закроет потребность в акцентном пятне над круглым обеденным столом. Бетон тяжелый, основательный. Провод регулируется легко. Магазину отдельное спасибо за премиальную деревянную упаковку — распаковка как отдельный вид искусства.»
                        </p>
                        <div className="flex justify-between items-center pt-4 border-t border-black/5 text-xs">
                            <div>
                                <h4 className="font-bold uppercase tracking-wide">Елена В.</h4>
                                <p className="text-zinc-500 mt-0.5">Частный дизайнер, Спб</p>
                            </div>
                            <span className="text-zinc-400 font-medium">29 Апреля 2026</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- РЕКОМЕНДАЦИИ (Соберите комплект) --- */}
            <section className="pt-16 border-t border-black/10 space-y-10">
                <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-400">Архитектурный ансамбль</span>
                    <h2 className="text-3xl font-black uppercase tracking-tight mt-1">Дополните световой сценарий</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendations.map((item) => (
                        <div key={item.id} className="group flex flex-col space-y-3">
                            <div className="w-full aspect-3/4 overflow-hidden rounded-3xl relative bg-zinc-300 shadow-sm">
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 group-hover:scale-103 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex justify-end items-end">
                                    <button className="bg-white text-black p-2.5 rounded-full shadow-md hover:bg-black hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <span className="absolute bottom-3 left-3 text-[9px] font-bold tracking-widest bg-white/90 px-2.5 py-0.5 rounded-full uppercase">
                                    {item.tag}
                                </span>
                            </div>
                            <div className="flex items-start justify-between px-1 text-xs">
                                <div>
                                    <h4 className="font-black uppercase tracking-tight group-hover:underline underline-offset-2 cursor-pointer">{item.name}</h4>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">Коллекционные объекты</p>
                                </div>
                                <span className="font-bold text-zinc-900">{item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    )
}