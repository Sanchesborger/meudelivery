"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { OTPInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function VerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const supabase = createClientComponentClient();

    useEffect(() => {
        if (!phone) {
            router.push("/login");
            return;
        }

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [phone, router]);

    const handleVerifyOTP = async (otp: string) => {
        if (!phone) return;

        setIsLoading(true);
        setError("");

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                phone,
                token: otp,
                type: "sms",
            });

            if (verifyError) {
                setError("Código inválido. Tente novamente.");
                setIsLoading(false);
                return;
            }

            // Success - redirect to home
            router.push("/home");
        } catch (err) {
            setError("Erro ao verificar código. Tente novamente.");
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!phone || !canResend) return;

        setCanResend(false);
        setCountdown(60);
        setError("");

        try {
            const { error: resendError } = await supabase.auth.signInWithOtp({
                phone,
            });

            if (resendError) {
                setError("Erro ao reenviar código.");
            }
        } catch (err) {
            setError("Erro ao reenviar código.");
        }
    };

    if (!phone) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Voltar</span>
            </button>

            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold font-heading mb-2">
                    Verificar telefone
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Digite o código enviado para
                </p>
                <p className="font-medium text-primary-600 mt-1">{phone}</p>
            </div>

            {/* OTP Input */}
            <div className="py-4">
                <OTPInput onComplete={handleVerifyOTP} isLoading={isLoading} />
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {error}
                    </p>
                </div>
            )}

            {/* Resend Code */}
            <div className="text-center">
                {canResend ? (
                    <Button
                        variant="ghost"
                        onClick={handleResendCode}
                        className="text-primary-600 hover:text-primary-700"
                    >
                        Reenviar código
                    </Button>
                ) : (
                    <p className="text-sm text-neutral-500">
                        Reenviar código em {countdown}s
                    </p>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Verificando...
                    </p>
                </div>
            )}
        </div>
    );
}
