import { GuardedPage } from "@/components/GuardedPage";
import { Profile } from "@/entities/profile";

export default function ProfilePage() {
    return (
        <GuardedPage>
            <Profile />
        </GuardedPage>
    )
}