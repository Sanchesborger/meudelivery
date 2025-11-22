"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthLayout({
    children,
}: {
    children: React.Node;
}) {
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        // Check if user is already logged in
        const checkUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (session) {
                router.replace("/home");
            }
        };

        checkUser();
    }, [router, supabase]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

            <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        DeliveryX
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                        Seu delivery favorito
                    </p>
                </div>

                {/* Content */}
                <div className="w-full max-w-md">
                    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-8">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
                    © 2024 DeliveryX. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}
