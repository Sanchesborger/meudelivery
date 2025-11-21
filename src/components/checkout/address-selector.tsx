"use client";

import { useState } from "react";
import { MapPin, Home, Briefcase, Plus, Edit2, Check } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Address } from "@/types";

interface AddressSelectorProps {
    open: boolean;
    onClose: () => void;
    addresses: Address[];
    selectedAddressId?: string;
    onSelectAddress: (address: Address) => void;
    onAddNew: () => void;
    onEdit: (address: Address) => void;
}

export function AddressSelector({
    open,
    onClose,
    addresses,
    selectedAddressId,
    onSelectAddress,
    onAddNew,
    onEdit,
}: AddressSelectorProps) {
    const [localSelectedId, setLocalSelectedId] = useState(selectedAddressId);

    const handleSelect = (address: Address) => {
        setLocalSelectedId(address.id);
    };

    const handleConfirm = () => {
        const selectedAddress = addresses.find((a) => a.id === localSelectedId);
        if (selectedAddress) {
            onSelectAddress(selectedAddress);
        }
        onClose();
    };

    const getAddressIcon = (type: string) => {
        switch (type) {
            case "home":
                return <Home className="h-5 w-5" />;
            case "work":
                return <Briefcase className="h-5 w-5" />;
            default:
                return <MapPin className="h-5 w-5" />;
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Endereço de entrega" size="md">
            <div className="space-y-4">
                {/* Address List */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {addresses.map((address) => {
                        const isSelected = address.id === localSelectedId;
                        const isDefault = address.is_default;

                        return (
                            <Card
                                key={address.id}
                                variant={isSelected ? "elevated" : "outlined"}
                                padding="md"
                                className={cn(
                                    "cursor-pointer transition-all hover:shadow-md",
                                    isSelected && "border-2 border-primary-500"
                                )}
                                onClick={() => handleSelect(address)}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Radio/Check */}
                                    <div
                                        className={cn(
                                            "flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0",
                                            isSelected
                                                ? "border-primary-500 bg-primary-500"
                                                : "border-neutral-300 dark:border-neutral-600"
                                        )}
                                    >
                                        {isSelected && (
                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                        )}
                                    </div>

                                    {/* Icon */}
                                    <div
                                        className={cn(
                                            "p-2 rounded-lg flex-shrink-0",
                                            isSelected
                                                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600"
                                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                                        )}
                                    >
                                        {getAddressIcon(address.type)}
                                    </div>

                                    {/* Address Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold">{address.label}</h4>
                                            {isDefault && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 font-medium">
                                                    Padrão
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                            {address.street}, {address.number}
                                            {address.complement && ` - ${address.complement}`}
                                            <br />
                                            {address.neighborhood} - {address.city}, {address.state}
                                        </p>
                                    </div>

                                    {/* Edit Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(address);
                                        }}
                                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0"
                                    >
                                        <Edit2 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </button>
                                </div>
                            </Card>
                        );
                    })}

                    {/* Add New Address Button */}
                    <button
                        onClick={onAddNew}
                        className="w-full p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="font-medium">Adicionar novo endereço</span>
                    </button>
                </div>

                {/* Confirm Button */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button
                        fullWidth
                        size="lg"
                        onClick={handleConfirm}
                        disabled={!localSelectedId}
                    >
                        Confirmar endereço
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
