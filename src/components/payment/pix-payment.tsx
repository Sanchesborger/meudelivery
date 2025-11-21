"use client";

import { useState, useEffect } from "react";
import { QrCode, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface PixPaymentProps {
    amount: number;
    onSuccess?: () => void;
}

export function PixPayment({ amount, onSuccess }: PixPaymentProps) {
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

    // Mock PIX key
    const pixKey = "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p65204000053039865802BR5925DELIVERYX LTDA6009SAO PAULO62070503***6304ABCD";

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleCopyPixKey = async () => {
        try {
            await navigator.clipboard.writeText(pixKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg mb-4">
                        {/* Mock QR Code */}
                        <div className="w-48 h-48 bg-neutral-900 rounded-lg flex items-center justify-center">
                            <QrCode className="h-32 w-32 text-white" />
                        </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                        Escaneie o QR Code com o app do seu banco
                    </p>
                </div>
            </div>

            {/* Amount */}
            <div className="text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Valor a pagar
                </p>
                <p className="text-3xl font-bold text-primary-600">
                    {formatCurrency(amount)}
                </p>
            </div>

            {/* Timer */}
            <div className="bg-secondary-50 dark:bg-secondary-950/20 border border-secondary-200 dark:border-secondary-800 rounded-xl p-4 text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Código expira em
                </p>
                <p className="text-2xl font-bold font-mono text-secondary-700 dark:text-secondary-400">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
            </div>

            {/* PIX Key */}
            <div>
                <p className="text-sm font-medium mb-2">Ou copie o código PIX:</p>
                <div className="flex gap-2">
                    <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                        {pixKey.substring(0, 50)}...
                    </div>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleCopyPixKey}
                        className="flex-shrink-0"
                    >
                        {copied ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-accent-600" />
                                <span className="ml-2">Copiado!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-5 w-5" />
                                <span className="ml-2">Copiar</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Como pagar com PIX
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                    <li>Abra o app do seu banco</li>
                    <li>Escolha pagar com PIX</li>
                    <li>Escaneie o QR Code ou cole o código</li>
                    <li>Confirme o pagamento</li>
                </ol>
            </div>
        </div>
    );
}
