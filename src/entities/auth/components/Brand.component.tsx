import Link from "next/link";

const BRASS = "#9a7b4f";

export const BrandComponent = () => (
    <Link href="/" className="text-sm font-black tracking-tight text-zinc-900">
        luxf<span style={{ color: BRASS }}>.</span>light
    </Link>
)