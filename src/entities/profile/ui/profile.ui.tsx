'use client'

import { Container } from "@/components/Container";
import { ProfileContent, ProfileHeader, ProfileTabs } from "..";
import { ProfileProvider } from "../module/profile.context";
import { PageItem, PageStagger } from "@/components/Animations";

export const ProfileUi = () => {
    return (
        <ProfileProvider>
            <Container>
                <PageStagger>
                    <PageItem>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase mb-6 sm:mb-8">
                            Личный кабинет
                        </h1>
                    </PageItem>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
                        <PageItem className="md:col-span-4 bg-[#F5F4F1] rounded-3xl p-4 sm:p-6 h-fit md:sticky md:top-24">
                            <ProfileHeader />
                            <ProfileTabs />
                        </PageItem>

                        <PageItem className="md:col-span-8">
                            <ProfileContent />
                        </PageItem>
                    </div>
                </PageStagger>
            </Container>
        </ProfileProvider>
    );
};