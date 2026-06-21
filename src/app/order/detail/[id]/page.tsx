import { OrderDetailUi } from '@/entities/profile/ui/order-detail.ui';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <OrderDetailUi orderId={id} />;
}
