"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { ProductExtrasGroup, ExtraGroupData } from "./product-extras-group";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface ProductModalProps {
    product: MenuItem | null;
    open: boolean;
    onClose: () => void;
    onAddToCart: (item: {
        product: MenuItem;
        quantity: number;
        selectedSize?: string;
        selectedExtras: string[];
        notes: string;
    }) => void;
    extraGroups?: ExtraGroupData[];
    sizes?: { id: string; name: string; priceMultiplier: number }[];
}

export function ProductModal({
    product,
    open,
    onClose,
    onAddToCart,
    extraGroups = [],
    sizes = [],
}: ProductModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string>(sizes[0]?.id || "medium");
    const [selectedExtrasByGroup, setSelectedExtrasByGroup] = useState<Record<string, string[]>>({});
    const [notes, setNotes] = useState("");

    if (!product) return null;

    // Calculate total price
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

    const handleExtrasChange = (groupId: string, extraIds: string[]) => {
        setSelectedExtrasByGroup((prev) => ({
            ...prev,
            [groupId]: extraIds,
        }));
    };

    const handleAddToCart = () => {
        onAddToCart({
            product,
            quantity,
            selectedSize: sizes.length > 0 ? selectedSize : undefined,
            selectedExtras: selectedExtrasFlat,
            notes,
        });
        handleClose();
    };

    const handleClose = () => {
        setQuantity(1);
        setSelectedSize(sizes[0]?.id || "medium");
        setSelectedExtrasByGroup({});
        setNotes("");
        onClose();
    };

    // Check if all required groups are satisfied
    const canAddToCart = useMemo(() => {
        return extraGroups
            .filter((g) => g.required)
            .every((g) => {
                const selected = selectedExtrasByGroup[g.id] || [];
                return selected.length >= g.minSelection && selected.length <= g.maxSelection;
            });
    }, [extraGroups, selectedExtrasByGroup]);

    return (
        <Modal open={open} onClose={handleClose} title="" size="lg" showCloseButton={false}>
            <div className="flex flex-col h-full max-h-[85vh]">
                {/* Header with Image */}
                <div className="relative">
                    {product.image_url && (
                        <div className="relative h-64 w-full bg-neutral-200 dark:bg-neutral-800">
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 bg-white dark:bg-neutral-900 rounded-full shadow-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* Product Info */}
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h2 className="text-2xl font-bold font-heading">{product.name}</h2>
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
                                <h4 className="font-semibold">Tamanho</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {sizes.map((size) => {
                                        const isSelected = size.id === selectedSize;
                                        return (
                                            <button
                                                key={size.id}
                                                onClick={() => setSelectedSize(size.id)}
                                                className={cn(
                                                    "p-3 rounded-xl border-2 font-medium transition-all text-center",
                                                    isSelected
                                                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                                                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                                                )}
                                            >
                                                {size.name}
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
                        <div className="space-y-2">
                            <label htmlFor="notes" className="font-semibold block">
                                Observações (opcional)
                            </label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Ex: Sem cebola, bem passado..."
                                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                rows={3}
                                maxLength={200}
                            />
                            <p className="text-xs text-neutral-500 text-right">
                                {notes.length}/200
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer with Quantity and Add Button */}
                <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-white dark:bg-neutral-900">
                    <div className="flex items-center gap-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-bold">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            fullWidth
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={!product.is_available || !canAddToCart}
                            className="flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span>Adicionar • {formatCurrency(totalPrice)}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
