import Link from "next/link"

const links = [
    {
        'link': '/',
        'name': 'О бренде',
    },
    {
        'link': '/catalog',
        'name': 'Каталог предметов'
    }
]


export const NavigationUi = () => {
    const page = '';
    return (
        <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
            {links.map((item, index) => (
                <Link
                    key={index}
                    className={`transition-colors ${page === '' ? 'text-black font-bold underline underline-offset-4' : 'text-zinc-600 hover:text-black'}`}
                    href={item.link}
                >
                    {item.name}
                </Link>
            ))}
        </nav>
    )
}