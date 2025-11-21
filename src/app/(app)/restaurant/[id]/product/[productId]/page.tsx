"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { ProductExtrasGroup } from "@/components/restaurant/product-extras-group";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency, cn } from "@/lib/utils";
import { PRODUCT_SIZES } from "@/lib/constants";
import { mockMenuItems, mockExtraGroups } from "@/lib/mock-data";

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCart();

    const productId = params.productId as string;
    const product = mockMenuItems.find(p => p.id === productId);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string>("medium");
    const [selectedExtrasByGroup, setSelectedExtrasByGroup] = useState<Record<string, string[]>>({});
    const [notes, setNotes] = useState("");

    // Determine helpers
    const sizes = useMemo(() => {
        if (!product || product.category_id !== "pizzas") return [];
        return PRODUCT_SIZES.map((size) => ({
            id: size.id,
            name: size.name,
            priceMultiplier: size.multiplier,
        }));
    }, [product]);

    const extraGroups = useMemo(() => {
        if (!product || product.category_id !== "pizzas") return [];
        return mockExtraGroups;
    }, [product]);

    // Initialize size if needed
    useMemo(() => {
        if (sizes.length > 0 && !sizes.find(s => s.id === selectedSize)) {
            setSelectedSize(sizes[0].id);
        }
    }, [sizes, selectedSize]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Produto não encontrado</p>
            </div>
        );
    }

    // Calculate totals
    const basePrice = product.price;
    const sizeMultiplier = sizes.find((s) => s.id === selectedSize)?.priceMultiplier || 1.0;

    const selectedExtrasFlat = Object.values(selectedExtrasByGroup).flat();
    const extrasPrice = selectedExtrasFlat.reduce((sum, extraId) => {
        const extra = extraGroups
            .flatMap((g) => g.extras)
            .find((e) => e.id === extraId);
        return sum + (extra?.price || 0);
    }, 0);

    const itemPrice = (basePrice * sizeMultiplier) + extrasPrice;
    const totalPrice = itemPrice * quantity;

    // Handlers
    const handleExtrasChange = (groupId: string, extraIds: string[]) => {
        setSelectedExtrasByGroup((prev) => ({
            ...prev,
            [groupId]: extraIds,
        }));
    };

    const handleAddToCart = () => {
        // In a real app, we would pass all options. 
        // For now, the useCart hook is simple.
        addItem(product, quantity, notes);
        router.back();
    };

    // Validation
    const canAddToCart = extraGroups
        .filter((g) => g.required)
        .every((g) => {
            const selected = selectedExtrasByGroup[g.id] || [];
            return selected.length >= g.minSelection && selected.length <= g.maxSelection;
        });

    return (
        <div className="min-h-screen pb-32 bg-white dark:bg-neutral-950">
            <Header title={product.name} showBack sticky={false} />

            {/* Cover Image */}
            <div className="relative h-64 w-full bg-neutral-200 dark:bg-neutral-800">
                {product.image_url && (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
            </div>

            <div className="container mx-auto px-4 py-6 relative z-10">
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800 space-y-6">

                    {/* Header Info */}
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h1 className="text-2xl font-bold font-heading">{product.name}</h1>
                            {!product.is_available && (
                                <Badge variant="error">Indisponível</Badge>
                            )}
                        </div>
                        {product.description && (
                            <p className="text-neutral-600 dark:text-neutral-400">
                                {product.description}
                            </p>
                        )}
                        <p className="text-2xl font-bold text-primary-600 mt-3">
                            {formatCurrency(basePrice)}
                        </p>
                    </div>

                    {/* Size Selection */}
                    {sizes.length > 0 && (
                        <>
                            <Divider />
                            <div className="space-y-3">
                                <h4 className="font-semibold text-lg">Tamanho</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {sizes.map((size) => {
                                        const isSelected = size.id === selectedSize;
                                        return (
                                            <button
                                                key={size.id}
                                                onClick={() => setSelectedSize(size.id)}
                                                className={cn(
                                                    "p-4 rounded-xl border-2 font-medium transition-all text-center flex flex-col items-center gap-1",
                                                    isSelected
                                                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                                                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                                                )}
                                            >
                                                <span>{size.name}</span>
                                                {size.priceMultiplier !== 1 && (
                                                    <span className="text-xs opacity-75">
                                                        x{size.priceMultiplier}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Extra Groups */}
                    {extraGroups.map((group) => (
                        <div key={group.id}>
                            <Divider />
                            <ProductExtrasGroup
                                group={group}
                                selectedExtras={selectedExtrasByGroup[group.id] || []}
                                onExtrasChange={(extraIds) => handleExtrasChange(group.id, extraIds)}
                            />
                        </div>
                    ))}

                    {/* Notes */}
                    <div>
                        <Divider />
                        <div className="space-y-3">
                            <label htmlFor="notes" className="font-semibold text-lg block">
                                Observações (opcional)
                            </label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Ex: Sem cebola, bem passado..."
                                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                rows={4}
                                maxLength={200}
                            />
                            <p className="text-xs text-neutral-500 text-right">
                                {notes.length}/200
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer with Add to Cart Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)]">
                <div className="container mx-auto px-4 py-4 safe-bottom">
                    <div className="flex items-center gap-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-2 border border-neutral-200 dark:border-neutral-700">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-5 w-5" />
                            </button>
                            <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Add to Cart Button with Gradient */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.is_available || !canAddToCart}
                            className="flex-1 h-14 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:from-neutral-400 disabled:to-neutral-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span>Adicionar • {formatCurrency(totalPrice)}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
