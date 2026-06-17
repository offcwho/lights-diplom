import { GuardedPage } from "@/components/GuardedPage";
import { Checkout } from "@/entities/checkout";

export default function CheckoutPage() {
    return (
        <GuardedPage>
            <Checkout />
        </GuardedPage>
    )
}