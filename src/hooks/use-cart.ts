"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartItem, MenuItem, Restaurant } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";
import toast from "react-hot-toast";

interface CartStore extends Cart {
    addItem: (menuItem: MenuItem, quantity?: number, notes?: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    updateNotes: (itemId: string, notes: string) => void;
    clearCart: () => void;
    setRestaurant: (restaurant: Restaurant) => void;
    setDeliveryFee: (fee: number) => void;
    setDiscount: (discount: number) => void;
    calculateTotals: () => void;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            restaurant: null,
            subtotal: 0,
            deliveryFee: 0,
            discount: 0,
            total: 0,

            addItem: (menuItem, quantity = 1, notes = "") => {
                const state = get();

                // Check if adding from different restaurant
                if (state.restaurant && state.restaurant.id !== menuItem.restaurant_id) {
                    toast.error("Você só pode adicionar itens do mesmo restaurante");
                    return;
                }

                const existingItem = state.items.find((item) => item.menuItem.id === menuItem.id);

                if (existingItem) {
                    set({
                        items: state.items.map((item) =>
                            item.menuItem.id === menuItem.id
                                ? {
                                    ...item,
                                    quantity: item.quantity + quantity,
                                    subtotal: (item.quantity + quantity) * menuItem.price,
                                }
                                : item
                        ),
                    });
                } else {
                    const newItem: CartItem = {
                        id: `${menuItem.id}-${Date.now()}`,
                        menuItem,
                        quantity,
                        notes,
                        subtotal: menuItem.price * quantity,
                    };
                    set({ items: [...state.items, newItem] });
                }

                get().calculateTotals();
                toast.success("Item adicionado ao carrinho");
            },

            removeItem: (itemId) => {
                const state = get();
                set({ items: state.items.filter((item) => item.id !== itemId) });
                get().calculateTotals();
                toast.success("Item removido do carrinho");
            },

            updateQuantity: (itemId, quantity) => {
                const state = get();
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }

                set({
                    items: state.items.map((item) =>
                        item.id === itemId
                            ? {
                                ...item,
                                quantity,
                                subtotal: quantity * item.menuItem.price,
                            }
                            : item
                    ),
                });
                get().calculateTotals();
            },

            updateNotes: (itemId, notes) => {
                const state = get();
                set({
                    items: state.items.map((item) =>
                        item.id === itemId ? { ...item, notes } : item
                    ),
                });
            },

            clearCart: () => {
                set({
                    items: [],
                    restaurant: null,
                    subtotal: 0,
                    deliveryFee: 0,
                    discount: 0,
                    total: 0,
                });
                toast.success("Carrinho limpo");
            },

            setRestaurant: (restaurant) => {
                set({ restaurant, deliveryFee: restaurant.delivery_fee });
                get().calculateTotals();
            },

            setDeliveryFee: (fee) => {
                set({ deliveryFee: fee });
                get().calculateTotals();
            },

            setDiscount: (discount) => {
                set({ discount });
                get().calculateTotals();
            },

            calculateTotals: () => {
                const state = get();
                const subtotal = state.items.reduce((sum, item) => sum + item.subtotal, 0);
                const total = subtotal + state.deliveryFee - state.discount;
                set({ subtotal, total });
            },
        }),
        {
            name: STORAGE_KEYS.cart,
        }
    )
);
