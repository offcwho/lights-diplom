import { PaymentUi } from '@/entities/payment/ui/payment.ui';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function PaymentPage({ params }: Props) {
    const { id } = await params;
    return <PaymentUi orderId={id} />;
}
