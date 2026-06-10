'use client'

import { AnimatePresence, motion } from "framer-motion"
import { useProfile } from "../module/profile.context"
import { ProfileOrders, ProfileAddresses, ProfileSettings } from ".."

export const ProfileContentUi = () => {
    const { activeTab } = useProfile()

    return (
        <div className="md:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="space-y-3 sm:space-y-4"
                >
                    {activeTab === 'orders' && <ProfileOrders />}
                    {activeTab === 'addresses' && <ProfileAddresses />}
                    {activeTab === 'settings' && <ProfileSettings />}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}