"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Plus, Minus, Tag } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
    const {
        items,
        restaurant,
        subtotal,
        deliveryFee,
        discount,
        total,
        updateQuantity,
        removeItem,
        clearCart,
    } = useCart();

    const [couponCode, setCouponCode] = useState("");

    const handleApplyCoupon = () => {
        // TODO: Implement coupon validation
        console.log("Applying coupon:", couponCode);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen pb-20">
                <Header title="Carrinho" showBack />
                <div className="container mx-auto px-4 py-12 text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-xl font-semibold font-heading mb-2">
                        Seu carrinho está vazio
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Adicione itens para começar seu pedido
                    </p>
                    <Button onClick={() => (window.location.href = "/")}>
                        Ver restaurantes
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32">
            <Header
                title="Carrinho"
                showBack
                rightAction={
                    <button
                        onClick={clearCart}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                        Limpar
                    </button>
                }
            />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Restaurant Info */}
                {restaurant && (
                    <Card variant="outlined" padding="md">
                        <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                                <Image
                                    src={restaurant.logo_image}
                                    alt={restaurant.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold">{restaurant.name}</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {restaurant.address}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Cart Items */}
                <div className="space-y-3">
                    {items.map((item) => (
                        <Card key={item.id} variant="outlined" padding="md">
                            <div className="flex gap-3">
                                {item.menuItem.image_url && (
                                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
                                        <Image
                                            src={item.menuItem.image_url}
                                            alt={item.menuItem.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold">{item.menuItem.name}</h4>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-600 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {item.notes && (
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Obs: {item.notes}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <span className="font-bold text-primary-600">
                                            {formatCurrency(item.subtotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Coupon */}
                <Card variant="outlined" padding="md">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Código do cupom"
                            leftIcon={<Tag className="h-5 w-5" />}
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            fullWidth
                        />
                        <Button onClick={handleApplyCoupon} variant="outline">
                            Aplicar
                        </Button>
                    </div>
                </Card>

                {/* Order Summary */}
                <Card variant="elevated" padding="lg">
                    <h3 className="font-semibold font-heading mb-4">Resumo do pedido</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                                Subtotal
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
                </Card>
            </div>

            {/* Fixed Checkout Button */}
            <div className="fixed bottom-20 left-0 right-0 z-40 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-4 safe-bottom">
                <Button
                    fullWidth
                    size="lg"
                    onClick={() => (window.location.href = "/checkout")}
                >
                    Finalizar pedido • {formatCurrency(total)}
                </Button>
            </div>
        </div>
    );
}
