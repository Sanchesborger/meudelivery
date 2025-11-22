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
            <div className="fixed bottom-20 left-0 right-0 z-40 bg-gradient-to-t from-white via-white to-white/80 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900/80 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
                <div className="container mx-auto px-4 py-5 safe-bottom">
                    <button
                        onClick={() => (window.location.href = "/checkout")}
                        className="group relative w-full h-16 rounded-lg font-bold text-lg text-white bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 hover:from-primary-700 hover:via-primary-600 hover:to-accent-600 shadow-[0_4px_20px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_6px_28px_rgba(var(--primary-rgb),0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                        <span className="relative flex items-center justify-between px-6">
                            <span className="flex items-center gap-2">
                                <span className="text-base font-medium opacity-90">Finalizar pedido</span>
                            </span>
                            <span className="text-xl font-bold tracking-tight">{formatCurrency(total)}</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
