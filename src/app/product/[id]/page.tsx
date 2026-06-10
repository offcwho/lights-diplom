import { Product } from "@/entities/product";

export default async function ProductPage({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return <Product productId={id} />
}