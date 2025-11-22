"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneAuth } from "@/components/auth/phone-auth";
import { SocialAuth } from "@/components/auth/social-auth";
import { Divider } from "@/components/ui/divider";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneSubmit = async (phone: string) => {
        setIsLoading(true);
        try {
            // Phone will be handled by PhoneAuth component
            router.push(`/verify?phone=${encodeURIComponent(phone)}`);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold font-heading mb-2">
                    Bem-vindo de volta!
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Entre para fazer seu pedido
                </p>
            </div>

            {/* Phone Authentication */}
            <PhoneAuth onSubmit={handlePhoneSubmit} isLoading={isLoading} />

            {/* Divider */}
            <div className="relative">
                <Divider />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white dark:bg-neutral-900 px-4 text-sm text-neutral-500">
                        ou continue com
                    </span>
                </div>
            </div>

            {/* Social Authentication */}
            <SocialAuth />

            {/* Terms */}
            <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                Ao continuar, você concorda com nossos{" "}
                <a href="#" className="text-primary-600 hover:underline">
                    Termos de Uso
                </a>{" "}
                e{" "}
                <a href="#" className="text-primary-600 hover:underline">
                    Política de Privacidade
                </a>
            </p>
        </div>
    );
}
