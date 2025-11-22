"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface PhoneAuthProps {
    onSubmit: (phone: string) => void;
    isLoading?: boolean;
}

export function PhoneAuth({ onSubmit, isLoading = false }: PhoneAuthProps) {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const supabase = createClientComponentClient();

    const formatPhone = (value: string) => {
        // Remove tudo exceto números
        const numbers = value.replace(/\D/g, "");

        // Formata como (XX) XXXXX-XXXX
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 7)
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setPhone(formatted);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação básica
        const numbers = phone.replace(/\D/g, "");
        if (numbers.length !== 11) {
            setError("Digite um número de telefone válido");
            return;
        }

        try {
            // Formata para E.164 format (+55XXXXXXXXXXX)
            const formattedPhone = `+55${numbers}`;

            // Envia OTP via Supabase
            const { error: authError } = await supabase.auth.signInWithOtp({
                phone: formattedPhone,
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            onSubmit(formattedPhone);
        } catch (err) {
            setError("Erro ao enviar código. Tente novamente.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                    Número de telefone
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-neutral-400" />
                    </div>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="pl-10"
                        maxLength={15}
                        disabled={isLoading}
                    />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 hover:from-primary-700 hover:via-primary-600 hover:to-accent-600"
                disabled={isLoading || phone.replace(/\D/g, "").length !== 11}
            >
                {isLoading ? "Enviando..." : "Continuar"}
            </Button>
        </form>
    );
}
