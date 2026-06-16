'use client'

import { useAuth } from "@/hooks/AuthContext"

export const GuardedPage = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();

    if (user) return <>{children}</>
    else {
        return (
            <div className="">404 </div>
        )
    }
}