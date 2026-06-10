'use client'

import { ProfileContent, ProfileHeader, ProfileTabs } from "..";
import { ProfileProvider } from "../module/profile.context";

export const ProfileUi = () => {
    return (
        <ProfileProvider>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fadeIn">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase mb-6 sm:mb-8">
                    Личный кабинет
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
                    {/* Карточка профиля с табами */}
                    <div className="md:col-span-4 bg-[#F5F4F1] rounded-3xl p-4 sm:p-6 h-fit md:sticky md:top-24">
                        {/* Шапка пользователя */}
                        <ProfileHeader />

                        {/* Табы */}
                        <ProfileTabs />
                    </div>

                    {/* Контент активного таба */}
                    <ProfileContent />
                </div>
            </div>
        </ProfileProvider>
    );
};