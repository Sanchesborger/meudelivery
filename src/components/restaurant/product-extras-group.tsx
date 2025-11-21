"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Extra } from "@/types";

export interface ExtraGroupData {
    id: string;
    name: string;
    required: boolean;
    minSelection: number;
    maxSelection: number;
    extras: Extra[];
}

interface ProductExtrasGroupProps {
    group: ExtraGroupData;
    selectedExtras: string[];
    onExtrasChange: (extraIds: string[]) => void;
}

export function ProductExtrasGroup({
    group,
    selectedExtras,
    onExtrasChange,
}: ProductExtrasGroupProps) {
    const handleExtraToggle = (extraId: string) => {
        const isSelected = selectedExtras.includes(extraId);
        let newSelection: string[];

        if (isSelected) {
            newSelection = selectedExtras.filter((id) => id !== extraId);
        } else {
            if (selectedExtras.length >= group.maxSelection) {
                // Replace first selected if single selection
                if (group.maxSelection === 1) {
                    newSelection = [extraId];
                } else {
                    return; // Don't add if max reached
                }
            } else {
                newSelection = [...selectedExtras, extraId];
            }
        }

        onExtrasChange(newSelection);
    };

    const selectedCount = selectedExtras.length;
    const canSelect = selectedCount < group.maxSelection;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                    {group.name}
                    {group.required && <span className="text-red-500 ml-1">*</span>}
                </h4>
                <span className="text-xs text-neutral-500">
                    {group.maxSelection === 1
                        ? "Escolha 1"
                        : group.minSelection === group.maxSelection
                            ? `Escolha ${group.maxSelection}`
                            : `Escolha até ${group.maxSelection}`}
                </span>
            </div>

            <div className="space-y-2">
                {group.extras.map((extra) => {
                    const isSelected = selectedExtras.includes(extra.id);
                    const isDisabled = !canSelect && !isSelected;

                    return (
                        <button
                            key={extra.id}
                            onClick={() => handleExtraToggle(extra.id)}
                            disabled={isDisabled}
                            className={cn(
                                "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                                isSelected
                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700",
                                isDisabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all",
                                        isSelected
                                            ? "border-primary-500 bg-primary-500"
                                            : "border-neutral-300 dark:border-neutral-600"
                                    )}
                                >
                                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                </div>
                                <span
                                    className={cn(
                                        "font-medium",
                                        isSelected
                                            ? "text-primary-700 dark:text-primary-400"
                                            : "text-neutral-700 dark:text-neutral-300"
                                    )}
                                >
                                    {extra.name}
                                </span>
                            </div>
                            {extra.price > 0 && (
                                <span
                                    className={cn(
                                        "text-sm font-semibold",
                                        isSelected
                                            ? "text-primary-600 dark:text-primary-400"
                                            : "text-neutral-600 dark:text-neutral-400"
                                    )}
                                >
                                    + {formatCurrency(extra.price)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {group.required && selectedCount < group.minSelection && (
                <p className="text-xs text-red-500">
                    Selecione pelo menos {group.minSelection} {group.minSelection === 1 ? "opção" : "opções"}
                </p>
            )}
        </div>
    );
}
