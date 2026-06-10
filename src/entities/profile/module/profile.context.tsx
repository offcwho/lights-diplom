'use client'

import { createContext, useContext, useState } from "react";

export type TabId = 'orders' | 'addresses' | 'settings';

const ProfileContext = createContext<{
    activeTab: TabId;
    setActiveTab: React.Dispatch<React.SetStateAction<TabId>>;
} | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeTab, setActiveTab] = useState<TabId>('orders');

    return (
        <ProfileContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
}