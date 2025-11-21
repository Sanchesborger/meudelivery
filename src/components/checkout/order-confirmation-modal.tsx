"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { MapPin, CreditCard, Clock, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Address } from "@/types";

interface OrderConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    address: Address;
    paymentMethod: string;
    itemCount: number;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    estimatedTime: number;
    isProcessing?: boolean;
}

export function OrderConfirmationModal({
    open,
    onClose,
    onConfirm,
    address,
    paymentMethod,
    itemCount,
    subtotal,
    deliveryFee,
    discount,
    total,
    estimatedTime,
    isProcessing = false,
}: OrderConfirmationModalProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Confirmar pedido"
            size="md"
            showCloseButton={!isProcessing}
        >
            <div className="space-y-5">
                {/* Estimated Time */}
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                        <Clock className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Tempo estimado de entrega
                        </p>
                        <p className="text-2xl font-bold text-primary-600">
                            {estimatedTime} min
                        </p>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">Endereço de entrega</span>
                    </div>
                    <div className="pl-6">
                        <p className="font-semibold">{address.label}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {address.street}, {address.number}
                            {address.complement && ` - ${address.complement}`}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {address.neighborhood} - {address.city}, {address.state}
                        </p>
                    </div>
                </div>

                <Divider />

                {/* Payment Method */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm font-medium">Forma de pagamento</span>
                    </div>
                    <div className="pl-6">
                        <p className="font-semibold uppercase">{paymentMethod}</p>
                    </div>
                </div>

                <Divider />

                {/* Order Summary */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Package className="h-4 w-4" />
                        <span className="text-sm font-medium">Resumo do pedido</span>
                    </div>
                    <div className="pl-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                                {itemCount} {itemCount === 1 ? "item" : "itens"}
                            </span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                                Taxa de entrega
                            </span>
                            <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-accent-600">
                                <span>Desconto</span>
                                <span className="font-medium">-{formatCurrency(discount)}</span>
                            </div>
                        )}
                        <Divider />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary-600">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button
                        fullWidth
                        size="lg"
                        onClick={onConfirm}
                        disabled={isProcessing}
                        isLoading={isProcessing}
                    >
                        {isProcessing ? "Processando..." : "Confirmar e fazer pedido"}
                    </Button>
                    <Button
                        fullWidth
                        variant="outline"
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        Revisar pedido
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
