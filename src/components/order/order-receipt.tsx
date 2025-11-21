"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Share2, Download, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrderReceiptProps {
    open: boolean;
    onClose: () => void;
    order: {
        id: string;
        createdAt: string;
        restaurant: {
            name: string;
            address: string;
        };
        items: Array<{
            id: string;
            name: string;
            quantity: number;
            price: number;
        }>;
        deliveryAddress: {
            street: string;
            number: string;
            complement?: string;
            neighborhood: string;
            city: string;
            state: string;
        };
        paymentMethod: string;
        subtotal: number;
        deliveryFee: number;
        discount: number;
        total: number;
    };
}

export function OrderReceipt({ open, onClose, order }: OrderReceiptProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Pedido #${order.id}`,
                text: `Meu pedido no ${order.restaurant.name} - Total: ${formatCurrency(order.total)}`,
            });
        } else {
            // Fallback: copy to clipboard
            const text = `Pedido #${order.id}\n${order.restaurant.name}\nTotal: ${formatCurrency(
                order.total
            )}`;
            navigator.clipboard.writeText(text);
            alert("Informações copiadas para a área de transferência!");
        }
    };

    const handleDownload = () => {
        // In a real app, this would generate a PDF
        alert("Funcionalidade de download em desenvolvimento");
    };

    return (
        <Modal open={open} onClose={onClose} title="Comprovante do Pedido" size="md">
            <div className="space-y-6">
                {/* Success Header */}
                <div className="text-center py-6 bg-accent-50 dark:bg-accent-900/20 rounded-xl">
                    <div className="flex justify-center mb-3">
                        <div className="p-3 bg-accent-100 dark:bg-accent-900/40 rounded-full">
                            <CheckCircle className="h-12 w-12 text-accent-600" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Pedido realizado!</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        {formatDate(order.createdAt)}
                    </p>
                </div>

                {/* Order Number */}
                <div className="text-center">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        Número do pedido
                    </p>
                    <p className="text-3xl font-bold font-mono">#{order.id}</p>
                </div>

                <Divider />

                {/* Restaurant Info */}
                <div>
                    <h4 className="font-semibold mb-2">Restaurante</h4>
                    <p className="text-neutral-700 dark:text-neutral-300">
                        {order.restaurant.name}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {order.restaurant.address}
                    </p>
                </div>

                <Divider />

                {/* Items */}
                <div>
                    <h4 className="font-semibold mb-3">Itens do pedido</h4>
                    <div className="space-y-2">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-neutral-700 dark:text-neutral-300">
                                    {item.quantity}x {item.name}
                                </span>
                                <span className="font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <Divider />

                {/* Delivery Address */}
                <div>
                    <h4 className="font-semibold mb-2">Endereço de entrega</h4>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {order.deliveryAddress.street}, {order.deliveryAddress.number}
                        {order.deliveryAddress.complement &&
                            ` - ${order.deliveryAddress.complement}`}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {order.deliveryAddress.neighborhood} - {order.deliveryAddress.city},{" "}
                        {order.deliveryAddress.state}
                    </p>
                </div>

                <Divider />

                {/* Payment Method */}
                <div>
                    <h4 className="font-semibold mb-2">Forma de pagamento</h4>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 uppercase">
                        {order.paymentMethod}
                    </p>
                </div>

                <Divider />

                {/* Totals */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                        <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">
                            Taxa de entrega
                        </span>
                        <span className="font-medium">{formatCurrency(order.deliveryFee)}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-sm text-accent-600">
                            <span>Desconto</span>
                            <span className="font-medium">-{formatCurrency(order.discount)}</span>
                        </div>
                    )}
                    <Divider />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary-600">{formatCurrency(order.total)}</span>
                    </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="flex justify-center py-4">
                    <div className="w-32 h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                        <p className="text-xs text-neutral-500">QR Code</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button variant="outline" onClick={handleShare} fullWidth>
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                    </Button>
                    <Button variant="outline" onClick={handleDownload} fullWidth>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
