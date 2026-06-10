'use client'

import { LayoutDashboard, Package, Settings } from "lucide-react";
import { TabId, useProfile } from "../module/profile.context";
import { motion } from "framer-motion";

const TABS: { id: TabId; name: string; icon: typeof Package }[] = [
    { id: 'orders', name: 'История заказов', icon: Package },
    { id: 'addresses', name: 'Адреса доставки', icon: LayoutDashboard },
    { id: 'settings', name: 'Настройки', icon: Settings },
];

export const ProfileTabsUi = () => {
    const { activeTab, setActiveTab } = useProfile();

    return (
        <nav className="flex md:flex-col gap-1 md:gap-2 overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 pb-1 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="relative flex items-center gap-2 md:gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 md:w-full text-left outline-none"
                    >
                        {/* Скользящая капсула активного таба */}
                        {isActive && (
                            <motion.span
                                layoutId="profile-tab-pill"
                                className="absolute inset-0 bg-black rounded-xl"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                        )}
                        <span className={`relative z-10 flex items-center gap-2 md:gap-3 transition-colors duration-200 ${isActive ? 'text-white' : 'text-zinc-600 hover:text-black'}`}>
                            <Icon size={16} className="shrink-0" />
                            <span>{tab.name}</span>
                        </span>
                    </button>
                );
            })}
        </nav>
    )
}