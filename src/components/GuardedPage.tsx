'use client'

import { useAuth } from "@/hooks/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const GuardedPage = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/sign-in');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-black/10 border-t-black animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}
