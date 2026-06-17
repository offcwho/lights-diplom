'use client'

import { Container } from "@/components/Container";
import { ProfileContent, ProfileHeader, ProfileTabs } from "..";
import { ProfileProvider } from "../module/profile.context";
import { PageItem, PageStagger } from "@/components/Animations";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProfileUi = () => {
    const router = useRouter()

    return (
        <ProfileProvider>
            <Container>
                <PageStagger>
                    <PageItem>
                        <div className="flex items-center justify-between w-full mb-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => router.back()}
                                    className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-neutral-700 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)] hover:scale-105 active:scale-95 transition-all"
                                >
                                    <ArrowLeft size={18} strokeWidth={2.5} />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">Личный кабинет</h1>
                                </div>
                            </div>
                        </div>
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