"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Edit2, Wallet, FileText } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PaymentMethodSelector } from "@/components/payment/payment-method-selector";
import { PixPayment } from "@/components/payment/pix-payment";
import { CardPayment, CardData } from "@/components/payment/card-payment";
import { AddressSelector } from "@/components/checkout/address-selector";
import { AddressForm } from "@/components/checkout/address-form";
import { OrderConfirmationModal } from "@/components/checkout/order-confirmation-modal";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { PAYMENT_METHODS, PaymentMethod } from "@/lib/constants";
import { Address } from "@/types";

// Mock addresses
const mockAddresses: Address[] = [
    {
        id: "1",
        user_id: "user-1",
        label: "Casa",
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
        street: "Avenida Paulista",
        number: "1500",
        complement: "Sala 210",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        zip_code: "01310-200",
        latitude: -23.5629,
        longitude: -46.6544,
        is_default: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, restaurant, subtotal, deliveryFee, discount, total, clearCart } = useCart();

    const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
    const [selectedAddress, setSelectedAddress] = useState<Address>(mockAddresses[0]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [orderNotes, setOrderNotes] = useState("");
    const [changeFor, setChangeFor] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Modal states
    const [showAddressSelector, setShowAddressSelector] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);

    // Redirect if cart is empty
    if (items.length === 0) {
        router.push("/cart");
        return null;
    }

    const handleSelectAddress = (address: Address) => {
        setSelectedAddress(address);
    };

    const handleAddNewAddress = () => {
        setAddressToEdit(null);
        setShowAddressSelector(false);
        setShowAddressForm(true);
    };

    const handleEditAddress = (address: Address) => {
        setAddressToEdit(address);
        setShowAddressSelector(false);
        setShowAddressForm(true);
    };

    const handleSaveAddress = (addressData: Partial<Address>) => {
        if (addressToEdit) {
            // Update existing
            setAddresses((prev) =>
                prev.map((addr) =>
                    addr.id === addressToEdit.id
                        ? { ...addr, ...addressData, updated_at: new Date().toISOString() }
                        : addressData.is_default
                            ? { ...addr, is_default: false }
                            : addr
                )
            );
        } else {
            // Add new
            const newAddress: Address = {
                ...addressData,
                id: Date.now().toString(),
                user_id: "user-1",
                latitude: -23.5505,
                longitude: -46.6333,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            } as Address;

            if (newAddress.is_default) {
                setAddresses((prev) =>
                    prev.map((addr) => ({ ...addr, is_default: false }))
                );
            }

            setAddresses((prev) => [...prev, newAddress]);
            setSelectedAddress(newAddress);
        }
    };

    const handleSelectPaymentMethod = (method: PaymentMethod) => {
        setSelectedPaymentMethod(method);
        if (
            method === PAYMENT_METHODS.PIX ||
            method === PAYMENT_METHODS.CREDIT_CARD ||
            method === PAYMENT_METHODS.DEBIT_CARD
        ) {
            setShowPaymentModal(true);
        }
    };

    const handleCardSubmit = (cardData: CardData) => {
        console.log("Card data:", cardData);
        setShowPaymentModal(false);
    };

    const handleProceedToConfirmation = () => {
        if (!selectedPaymentMethod) {
            alert("Por favor, selecione um método de pagamento");
            return;
        }
        setShowConfirmationModal(true);
    };

    const handleConfirmOrder = async () => {
        if (!selectedPaymentMethod) return;

        setIsProcessing(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Create mock order
        const orderId = Math.random().toString(36).substring(7);

        // Clear cart
        clearCart();

        // Redirect to order tracking
        router.push(`/order/${orderId}`);
    };

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen pb-32">
            <Header title="Checkout" showBack />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Delivery Address */}
                <Card variant="outlined" padding="md">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                            <MapPin className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold font-heading mb-1">
                                Endereço de entrega
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {selectedAddress.street}, {selectedAddress.number}
                                {selectedAddress.complement && ` - ${selectedAddress.complement}`}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {selectedAddress.neighborhood} - {selectedAddress.city},{" "}
                                {selectedAddress.state}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddressSelector(true)}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                            <Edit2 className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                        </button>
                    </div>
                </Card>

                {/* Order Items */}
                <Card variant="outlined" padding="md">
                    <h3 className="font-semibold font-heading mb-4">Seus itens</h3>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                {item.menuItem.image_url && (
                                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
                                        <Image
                                            src={item.menuItem.image_url}
                                            alt={item.menuItem.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {item.quantity}x {item.menuItem.name}
                                    </p>
                                    {item.notes && (
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                            Obs: {item.notes}
                                        </p>
                                    )}
                                </div>
                                <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                                    {formatCurrency(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Order Notes */}
                <Card variant="outlined" padding="md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <FileText className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <h3 className="font-semibold font-heading">
                            Observações para entrega
                        </h3>
                    </div>
                    <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Ex: Tocar a campainha, deixar na portaria..."
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        rows={3}
                        maxLength={200}
                    />
                    <p className="text-xs text-neutral-500 text-right mt-1">
                        {orderNotes.length}/200
                    </p>
                </Card>

                {/* Payment Method */}
                <Card variant="outlined" padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                            <Wallet className="h-5 w-5 text-secondary-600" />
                        </div>
                        <h3 className="font-semibold font-heading">Forma de pagamento</h3>
                    </div>

                    <PaymentMethodSelector
                        selectedMethod={selectedPaymentMethod}
                        onSelect={handleSelectPaymentMethod}
                    />

                    {/* Cash Change Input */}
                    {selectedPaymentMethod === PAYMENT_METHODS.CASH && (
                        <div className="mt-4">
                            <Input
                                label="Troco para quanto? (opcional)"
                                placeholder="Ex: R$ 50,00"
                                value={changeFor}
                                onChange={(e) => setChangeFor(e.target.value)}
                                fullWidth
                            />
                        </div>
                    )}
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
            <div className="fixed bottom-20 left-0 right-0 z-40 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-4 safe-bottom">
                <Button
                    fullWidth
                    size="lg"
                    onClick={handleProceedToConfirmation}
                    disabled={!selectedPaymentMethod}
                >
                    Revisar e confirmar • {formatCurrency(total)}
                </Button>
            </div>

            {/* Address Selector Modal */}
            <AddressSelector
                open={showAddressSelector}
                onClose={() => setShowAddressSelector(false)}
                addresses={addresses}
                selectedAddressId={selectedAddress.id}
                onSelectAddress={handleSelectAddress}
                onAddNew={handleAddNewAddress}
                onEdit={handleEditAddress}
            />

            {/* Address Form Modal */}
            <AddressForm
                open={showAddressForm}
                onClose={() => setShowAddressForm(false)}
                onSave={handleSaveAddress}
                initialAddress={addressToEdit}
            />

            {/* Payment Modal */}
            <Modal
                open={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                title={
                    selectedPaymentMethod === PAYMENT_METHODS.PIX
                        ? "Pagar com PIX"
                        : selectedPaymentMethod === PAYMENT_METHODS.CREDIT_CARD
                            ? "Cartão de Crédito"
                            : "Cartão de Débito"
                }
                size="md"
            >
                {selectedPaymentMethod === PAYMENT_METHODS.PIX ? (
                    <PixPayment
                        amount={total}
                        onSuccess={() => setShowPaymentModal(false)}
                    />
                ) : (
                    <div className="space-y-4">
                        <CardPayment onSubmit={handleCardSubmit} />
                        <Button
                            fullWidth
                            size="lg"
                            onClick={() => setShowPaymentModal(false)}
                        >
                            Salvar cartão e continuar
                        </Button>
                    </div>
                )}
            </Modal>

            {/* Order Confirmation Modal */}
            <OrderConfirmationModal
                open={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={handleConfirmOrder}
                address={selectedAddress}
                paymentMethod={selectedPaymentMethod || ""}
                itemCount={itemCount}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                discount={discount}
                total={total}
                estimatedTime={restaurant?.delivery_time || 30}
                isProcessing={isProcessing}
            />
        </div>
    );
}
