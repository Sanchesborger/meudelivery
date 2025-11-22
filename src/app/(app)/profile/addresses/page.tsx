"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Loader2 } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { AddressForm } from "@/components/address/address-form";
import { AddressCard } from "@/components/address/address-card";
import { Address } from "@/types";
import { addressService } from "@/services/addresses";
import { toast } from "sonner";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const fetchAddresses = async () => {
        try {
            const data = await addressService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Erro ao carregar endereços");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAddAddress = async (addressData: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">) => {
        try {
            await addressService.createAddress(addressData);
            await fetchAddresses();
            setShowAddForm(false);
            toast.success("Endereço adicionado com sucesso");
        } catch (error) {
            console.error("Error creating address:", error);
            toast.error("Erro ao adicionar endereço");
        }
    };

    const handleEditAddress = async (addressData: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">) => {
        if (!editingAddress) return;

        try {
            await addressService.updateAddress(editingAddress.id, addressData);
            await fetchAddresses();
            setEditingAddress(null);
            toast.success("Endereço atualizado com sucesso");
        } catch (error) {
            console.error("Error updating address:", error);
            toast.error("Erro ao atualizar endereço");
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        try {
            await addressService.deleteAddress(addressId);
            setAddresses(addresses.filter((addr) => addr.id !== addressId));
            toast.success("Endereço removido");
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error("Erro ao remover endereço");
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            await addressService.updateAddress(addressId, { is_default: true });
            await fetchAddresses();
            toast.success("Endereço padrão atualizado");
        } catch (error) {
            console.error("Error setting default address:", error);
            toast.error("Erro ao definir endereço padrão");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

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
