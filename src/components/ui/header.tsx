"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: ReactNode;
    className?: string;
    transparent?: boolean;
    sticky?: boolean;
    showCart?: boolean;
}

export function Header({
    title,
    showBack = false,
    onBack,
    rightAction,
    className,
    transparent = false,
    sticky = true,
    showCart = false,
}: HeaderProps) {
    const router = useRouter();
    const { items } = useCart();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header
            className={cn(
                "w-full border-b safe-top",
                sticky ? "sticky top-0 z-40" : "relative",
                transparent
                    ? "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-transparent"
                    : "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-neutral-200 dark:border-neutral-800",
                className
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            aria-label="Voltar"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}
                    {title && (
                        <h1 className="text-lg font-semibold font-heading truncate">{title}</h1>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {showCart && (
                        <button
                            onClick={() => router.push("/cart")}
                            className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            aria-label="Carrinho"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    )}
                    {rightAction}
                </div>
            </div>
        </header>
    );
}
