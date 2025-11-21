"use client";

import { Home, Briefcase, MapPin, MoreVertical, Edit2, Trash2, Star } from "lucide-react";
import { useState } from "react";
import { Address } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface AddressCardProps {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (addressId: string) => void;
    onSetDefault: (addressId: string) => void;
}

const addressIcons = {
    home: Home,
    work: Briefcase,
    other: MapPin,
};

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const Icon = addressIcons[address.type as keyof typeof addressIcons] || MapPin;

    return (
        <Card variant="outlined" padding="md" className="relative">
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                    <Icon className="h-5 w-5 text-primary-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold font-heading">{address.label}</h3>
                        {address.is_default && (
                            <Badge variant="success" size="sm">
                                Padrão
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {address.street}, {address.number}
                        {address.complement && ` - ${address.complement}`}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {address.neighborhood} - {address.city}, {address.state}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                        CEP: {address.zip_code}
                    </p>
                </div>

                {/* Menu Button */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                        <MoreVertical className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {showMenu && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />

                                {/* Menu */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-20 overflow-hidden"
                                >
                                    {!address.is_default && (
                                        <button
                                            onClick={() => {
                                                onSetDefault(address.id);
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                        >
                                            <Star className="h-4 w-4" />
                                            Definir como padrão
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            onEdit(address);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("Tem certeza que deseja excluir este endereço?")) {
                                                onDelete(address.id);
                                            }
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Excluir
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Card>
    );
}
