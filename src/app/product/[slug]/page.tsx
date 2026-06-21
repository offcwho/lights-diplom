import { Product } from "@/entities/product";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }>; }) {
    const { slug } = await params;

    return <Product slug={slug} />
}
