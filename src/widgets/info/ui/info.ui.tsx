import { Container } from "@/components/Container"
import { Award, Compass, Eye, Hammer } from "lucide-react"

export const InfoUi = () => {
    return (
        <Container>
            <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-[0.3em] text-zinc-400">Технологический цикл</span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Из чего складывается премиум</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-800 shadow-sm"><Hammer size={20} /></div>
                    <h4 className="font-bold uppercase text-sm tracking-wide">Крафтовое литье</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">Формы создаются индивидуально. Пузырьки воздуха формируют неповторимый ландшафт купола.</p>
                </div>
                <div className="space-y-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-800 shadow-sm"><Compass size={20} /></div>
                    <h4 className="font-bold uppercase text-sm tracking-wide">Точный фокус</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">Линзы COB-матриц рассчитываются инженерами для идеального светового пятна без искажений.</p>
                </div>
                <div className="space-y-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-800 shadow-sm"><Eye size={20} /></div>
                    <h4 className="font-bold uppercase text-sm tracking-wide">Комфорт зрения</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">Индекс цветопередачи CRI &gt; 95. Цвета предметов в комнате остаются такими же, как при солнце.</p>
                </div>
                <div className="space-y-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-800 shadow-sm"><Award size={20} /></div>
                    <h4 className="font-bold uppercase text-sm tracking-wide">Бессрочная гарантия</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">Мы уверены в архитектурной прочности корпусов и даем пожизненную поддержку элементов конструкции.</p>
                </div>
            </div>
        </Container>
    )
}