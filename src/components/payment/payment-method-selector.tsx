"use client";

import { CreditCard, Smartphone, Wallet, Banknote } from "lucide-react";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS, PaymentMethod } from "@/lib/constants";
import { motion } from "framer-motion";

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod | null;
    onSelect: (method: PaymentMethod) => void;
}

const paymentIcons: Record<PaymentMethod, any> = {
    [PAYMENT_METHODS.PIX]: Smartphone,
    [PAYMENT_METHODS.CREDIT_CARD]: CreditCard,
    [PAYMENT_METHODS.DEBIT_CARD]: CreditCard,
    [PAYMENT_METHODS.CASH]: Banknote,
};

export function PaymentMethodSelector({ selectedMethod, onSelect }: PaymentMethodSelectorProps) {
    const methods = Object.values(PAYMENT_METHODS);

    return (
        <div className="space-y-3">
            {methods.map((method) => {
                const Icon = paymentIcons[method];
                const isSelected = selectedMethod === method;

                return (
                    <motion.button
                        key={method}
                        onClick={() => onSelect(method)}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                            ${isSelected
                                ? "border-primary-600 bg-primary-50 dark:bg-primary-950/20"
                                : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700"
                            }
                        `}
                    >
                        <div className={`
                            p-3 rounded-lg
                            ${isSelected
                                ? "bg-primary-600 text-white"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                            }
                        `}>
                            <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 text-left">
                            <p className={`font-semibold ${isSelected ? "text-primary-600" : ""}`}>
                                {PAYMENT_METHOD_LABELS[method]}
                            </p>
                        </div>

                        {/* Radio Indicator */}
                        <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${isSelected
                                ? "border-primary-600"
                                : "border-neutral-300 dark:border-neutral-600"
                            }
                        `}>
                            {isSelected && (
                                <motion.div
                                    layoutId="payment-indicator"
                                    className="w-3 h-3 rounded-full bg-primary-600"
                                />
                            )}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
