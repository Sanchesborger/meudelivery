"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { useCart } from "@/hooks/use-cart";
import { MenuItem } from "@/types";

// Mock data for promotional products - In a real app this would come from an API
const promotionalProducts: MenuItem[] = [
    {
        id: "promo-1",
        restaurant_id: "1",
        category_id: "pizza",
        name: "Pizza Calabresa Especial",
        description: "Mussarela, calabresa artesanal, cebola roxa e orégano. Borda recheada grátis!",
        price: 39.90, // Original price might be higher
        image_url: "/products/pizza-calabresa.jpg",
        is_available: true,
        preparation_time: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "promo-2",
        restaurant_id: "2",
        category_id: "burger",
        name: "Combo Double Cheddar",
        description: "2 Hambúrgueres de 180g, muito cheddar, bacon crocante e batata frita grande.",
        price: 32.50,
        image_url: "/products/burger-combo.jpg",
        is_available: true,
        preparation_time: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "promo-3",
        restaurant_id: "3",
        category_id: "japanese",
        name: "Barca Sushi Premium",
        description: "40 peças variadas: sashimis, niguiris, hossomakis e uramakis. Ideal para 2 pessoas.",
        price: 89.90,
        image_url: "/products/sushi-boat.jpg",
        is_available: true,
        preparation_time: 40,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "promo-4",
        restaurant_id: "2",
        category_id: "burger",
        name: "X-Bacon Supremo",
        description: "Pão brioche, burger 200g, queijo prato, bacon em tiras e maionese da casa.",
        price: 24.90,
        image_url: "/products/x-bacon.jpg",
        is_available: true,
        preparation_time: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "promo-5",
        restaurant_id: "4",
        category_id: "dessert",
        name: "Grand Gâteau",
        description: "Bolo de chocolate quente com picolé de creme e calda de chocolate.",
        price: 18.90,
        image_url: "/products/grand-gateau.jpg",
        is_available: true,
        preparation_time: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "promo-6",
        restaurant_id: "1",
        category_id: "pizza",
        name: "Pizza 4 Queijos",
        description: "Mussarela, provolone, parmesão e gorgonzola. Acompanha refrigerante 2L.",
        price: 45.00,
        image_url: "/products/pizza-4queijos.jpg",
        is_available: true,
        preparation_time: 35,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

export default function PromosPage() {
    const router = useRouter();
    const { items, addItem } = useCart();

    const handleAddToCart = (product: MenuItem) => {
        addItem(product, 1);
    };

    return (
        <div className="min-h-screen pb-20 bg-neutral-50 dark:bg-neutral-950">
            {/* Header */}
            <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <h1 className="text-lg font-bold font-heading">Promoções</h1>

                        {/* Cart Button */}
                        <button
                            onClick={() => router.push("/cart")}
                            className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            aria-label="Carrinho"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {(() => {
                                const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
                                return cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                );
                            })()}
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 p-8 text-white shadow-lg">
                    <div className="relative z-10 max-w-md space-y-2">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-2 text-white">
                            Ofertas Relâmpago
                        </span>
                        <h2 className="text-3xl font-bold font-heading">
                            As Melhores Promoções <br /> Estão Aqui!
                        </h2>
                        <p className="text-white/90 text-sm md:text-base max-w-sm">
                            Descontos exclusivos em pizzas, lanches e muito mais. Aproveite antes que acabe!
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent transform skew-x-12 translate-x-1/2"></div>
                    <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 rotate-12 select-none">
                        🏷️
                    </div>
                    <div className="absolute top-4 right-10 text-4xl opacity-20 animate-bounce select-none delay-700">
                        ⚡
                    </div>
                </div>

                {/* Product List */}
                <section>
                    <h3 className="text-lg font-semibold font-heading mb-4">Destaques da Semana</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {promotionalProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                imagePosition="left"
                                onClick={() => router.push(`/restaurant/${product.restaurant_id}/product/${product.id}`)}
                                className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
