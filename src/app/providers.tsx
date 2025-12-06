"use client";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SWRConfig
                value={{
                    revalidateOnFocus: false,
                    revalidateOnReconnect: true,
                    dedupingInterval: 2000,
                    errorRetryCount: 3,
                    errorRetryInterval: 5000,
                    shouldRetryOnError: true,
                    onError: (error) => {
                        console.error('SWR Error:', error);
                    },
                }}
            >
                {children}
            </SWRConfig>
        </SessionProvider>
    );
}