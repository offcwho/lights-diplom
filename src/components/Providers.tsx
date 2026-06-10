import { HeaderHeightProvider } from "@/hooks/useHeaderHeight";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <HeaderHeightProvider>
            {children}
        </HeaderHeightProvider>
    )
};