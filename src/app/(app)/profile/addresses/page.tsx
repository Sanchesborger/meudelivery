"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { AddressForm } from "@/components/address/address-form";
import { AddressCard } from "@/components/address/address-card";
import { Address } from "@/types";

// Mock addresses
const mockAddresses: Address[] = [
    {
        id: "1",
        user_id: "user-1",
        label: "Minha Casa",
        type: "home",
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 45",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zip_code: "01310-100",
        latitude: -23.5505,
        longitude: -46.6333,
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "2",
        user_id: "user-1",
        label: "Trabalho",
        type: "work",
        street: "Av. Paulista",
        number: "1000",
        complement: "12º andar",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        zip_code: "01310-200",
        latitude: -23.5617,
        longitude: -46.6556,
        is_default: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const handleAddAddress = (addressData: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">) => {
        const newAddress: Address = {
            ...addressData,
            id: Math.random().toString(36).substring(7),
            user_id: "user-1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setAddresses([...addresses, newAddress]);
        setShowAddForm(false);
    };

    const handleEditAddress = (addressData: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">) => {
        if (!editingAddress) return;

        setAddresses(
            addresses.map((addr) =>
                addr.id === editingAddress.id
                    ? { ...addr, ...addressData, updated_at: new Date().toISOString() }
                    : addr
            )
        );
        setEditingAddress(null);
    };

    const handleDeleteAddress = (addressId: string) => {
        setAddresses(addresses.filter((addr) => addr.id !== addressId));
    };

    const handleSetDefault = (addressId: string) => {
        setAddresses(
            addresses.map((addr) => ({
                ...addr,
                is_default: addr.id === addressId,
            }))
        );
    };

    return (
        <div className="min-h-screen pb-20">
            <Header title="Meus Endereços" showBack />

            <div className="container mx-auto px-4 py-6">
                {addresses.length === 0 ? (
                    // Empty State
                    <div className="text-center py-12">
                        <div className="inline-flex p-6 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
                            <MapPin className="h-12 w-12 text-neutral-400 dark:text-neutral-600" />
                        </div>
                        <h3 className="text-xl font-semibold font-heading mb-2">
                            Nenhum endereço cadastrado
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Adicione um endereço para receber seus pedidos
                        </p>
                        <Button onClick={() => setShowAddForm(true)}>
                            <Plus className="h-5 w-5 mr-2" />
                            Adicionar endereço
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Add New Address Button */}
                        <Button
                            onClick={() => setShowAddForm(true)}
                            fullWidth
                            size="lg"
                            className="mb-6"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Adicionar novo endereço
                        </Button>

                        {/* Address List */}
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <AddressCard
                                    key={address.id}
                                    address={address}
                                    onEdit={setEditingAddress}
                                    onDelete={handleDeleteAddress}
                                    onSetDefault={handleSetDefault}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Add Address Sheet */}
            <Sheet
                open={showAddForm}
                onClose={() => setShowAddForm(false)}
                title="Novo endereço"
                size="lg"
            >
                <AddressForm
                    onSubmit={handleAddAddress}
                    onCancel={() => setShowAddForm(false)}
                />
            </Sheet>

            {/* Edit Address Sheet */}
            <Sheet
                open={!!editingAddress}
                onClose={() => setEditingAddress(null)}
                title="Editar endereço"
                size="lg"
            >
                {editingAddress && (
                    <AddressForm
                        initialData={editingAddress}
                        onSubmit={handleEditAddress}
                        onCancel={() => setEditingAddress(null)}
                    />
                )}
            </Sheet>
        </div>
    );
}
