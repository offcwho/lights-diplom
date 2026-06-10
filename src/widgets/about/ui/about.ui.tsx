import { Container } from "@/components/Container"

export const AboutUi = () => {
    return (
        <div className="bg-[#F5F4F1] rounded-[40px]">
            <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 order-last lg:order-first">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#EAE8E4] p-8 rounded-3xl space-y-2">
                            <span className="text-3xl font-black">100%</span>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Ручная работа</p>
                        </div>
                        <div className="bg-[#EAE8E4] p-8 rounded-3xl space-y-2">
                            <span className="text-3xl font-black">2018</span>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Год основания</p>
                        </div>
                        <div className="bg-[#EAE8E4] p-8 rounded-3xl space-y-2">
                            <span className="text-3xl font-black">24+</span>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Мировых шоурумов</p>
                        </div>
                        <div className="bg-[#EAE8E4] p-8 rounded-3xl space-y-2">
                            <span className="text-3xl font-black">iF</span>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Design Award</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                    <span className="text-xs uppercase font-bold tracking-[0.2em] text-zinc-400 block">Наш подход</span>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Честность материалов как ДНК
                    </h2>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        История бренда началась в небольшом ангаре, где мы экспериментировали со смесями жидкого кварца и
                        цемента марки М500. Мы отказались от пластика и бутафории. Если предмет кажется бетонным — это
                        монолитный бетон. Если золотым — это чистая шлифованная латунь.
                    </p>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Наш свет выбирают ведущие архитектурные бюро Европы и Азии для создания интерьеров с глубокой
                        медитативной атмосферой.
                    </p>
                </div>
            </Container>
        </div>
    )
}