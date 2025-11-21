"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CardPaymentProps {
    onSubmit: (cardData: CardData) => void;
}

export interface CardData {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
}

export function CardPayment({ onSubmit }: CardPaymentProps) {
    const [cardData, setCardData] = useState<CardData>({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
    });

    const [errors, setErrors] = useState<Partial<CardData>>({});

    // Format card number with spaces
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];

        for (let i = 0; i < match.length; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        return parts.length ? parts.join(" ") : value;
    };

    // Format expiry date
    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleCardNumberChange = (value: string) => {
        const formatted = formatCardNumber(value);
        if (formatted.replace(/\s/g, "").length <= 16) {
            setCardData({ ...cardData, number: formatted });
            setErrors({ ...errors, number: "" });
        }
    };

    const handleExpiryChange = (value: string) => {
        const formatted = formatExpiry(value);
        if (formatted.replace(/\//g, "").length <= 4) {
            setCardData({ ...cardData, expiry: formatted });
            setErrors({ ...errors, expiry: "" });
        }
    };

    const handleCvvChange = (value: string) => {
        const v = value.replace(/[^0-9]/gi, "");
        if (v.length <= 4) {
            setCardData({ ...cardData, cvv: v });
            setErrors({ ...errors, cvv: "" });
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<CardData> = {};

        if (cardData.number.replace(/\s/g, "").length < 13) {
            newErrors.number = "Número do cartão inválido";
        }

        if (!cardData.name || cardData.name.length < 3) {
            newErrors.name = "Nome é obrigatório";
        }

        if (cardData.expiry.length < 5) {
            newErrors.expiry = "Data inválida";
        }

        if (cardData.cvv.length < 3) {
            newErrors.cvv = "CVV inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(cardData);
        }
    };

    // Detect card brand
    const getCardBrand = (number: string) => {
        const cleaned = number.replace(/\s/g, "");
        if (cleaned.startsWith("4")) return "Visa";
        if (cleaned.startsWith("5")) return "Mastercard";
        if (cleaned.startsWith("3")) return "Amex";
        return null;
    };

    const cardBrand = getCardBrand(cardData.number);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Preview */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex justify-between items-start mb-8">
                    <CreditCard className="h-8 w-8" />
                    {cardBrand && (
                        <span className="text-sm font-semibold px-3 py-1 bg-white/20 rounded-full">
                            {cardBrand}
                        </span>
                    )}
                </div>
                <div className="space-y-4">
                    <p className="text-xl font-mono tracking-wider">
                        {cardData.number || "•••• •••• •••• ••••"}
                    </p>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs opacity-70 mb-1">Nome no cartão</p>
                            <p className="font-medium">
                                {cardData.name || "NOME COMPLETO"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs opacity-70 mb-1">Válido até</p>
                            <p className="font-medium font-mono">
                                {cardData.expiry || "MM/AA"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Number */}
            <Input
                label="Número do cartão"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                error={errors.number}
                leftIcon={<CreditCard className="h-5 w-5" />}
                fullWidth
            />

            {/* Cardholder Name */}
            <Input
                label="Nome no cartão"
                placeholder="Nome como está no cartão"
                value={cardData.name}
                onChange={(e) => {
                    setCardData({ ...cardData, name: e.target.value.toUpperCase() });
                    setErrors({ ...errors, name: "" });
                }}
                error={errors.name}
                fullWidth
            />

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Validade"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    error={errors.expiry}
                    fullWidth
                />
                <Input
                    label="CVV"
                    placeholder="123"
                    type="password"
                    value={cardData.cvv}
                    onChange={(e) => handleCvvChange(e.target.value)}
                    error={errors.cvv}
                    fullWidth
                />
            </div>

            {/* Security Info */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    🔒 Seus dados estão seguros e criptografados
                </p>
            </div>
        </form>
    );
}
