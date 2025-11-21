"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Card } from "./card";
import { Button } from "./button";
import { cn, formatCurrency } from "@/lib/utils";
import { MenuItem } from "@/types";

interface ProductCardProps {
    product: MenuItem;
    onAdd?: (product: MenuItem) => void;
    className?: string;
}

export function ProductCard({ product, onAdd, className }: ProductCardProps) {
    return (
        <Card
            variant="outlined"
            padding="none"
            className={cn("overflow-hidden", className)}
        >
            <div className="flex gap-3 p-3">
                <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-base font-heading line-clamp-2">
                        {product.name}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {formatCurrency(product.price)}
                        </span>
                        {onAdd && product.is_available && (
                            <Button
                                size="icon"
                                variant="primary"
                                onClick={() => onAdd(product)}
                                className="h-9 w-9 rounded-full"
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                    {!product.is_available && (
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                            Indisponível
                        </span>
                    )}
                </div>

                {product.image_url && (
                    <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
}
