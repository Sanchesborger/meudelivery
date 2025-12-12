"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { useCart } from "@/hooks/use-cart";
import { MenuItem } from "@/types";

// Mock data for snack products
const snackProducts: MenuItem[] = [
    {
        id: "snack-1",
        restaurant_id: "2",
        category_id: "burger",
        name: "X-Tudo Completo",
        description: "Hambúrguer, queijo, presunto, bacon, ovo, alface, tomate e batata palha.",
        price: 28.90,
        image_url: "/products/x-tudo.jpg",
        is_available: true,
        preparation_time: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "snack-2",
        restaurant_id: "2",
        category_id: "burger",
        name: "Cachorro-Quente Especial",
        description: "Salsicha premium, purê de batata, milho, ervilha, batata palha e molhos especiais.",
        price: 15.90,
        image_url: "/products/hot-dog.jpg",
        is_available: true,
        preparation_time: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "snack-3",
        restaurant_id: "2",
        category_id: "burger",
        name: "X-Bacon Artesanal",
        description: "Pão brioche, hambúrguer 180g, queijo cheddar, bacon crocante e cebola caramelizada.",
        price: 26.50,
        image_url: "/products/x-bacon-artesanal.jpg",
        is_available: true,
        preparation_time: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "snack-4",
        restaurant_id: "2",
        category_id: "burger",
        name: "Misto Quente Gourmet",
        description: "Pão de forma artesanal, presunto parma, queijo emmental e manteiga trufada.",
        price: 18.90,
        image_url: "/products/misto-gourmet.jpg",
        is_available: true,
        preparation_time: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "snack-5",
        restaurant_id: "2",
        category_id: "burger",
        name: "Bauru Tradicional",
        description: "Pão francês, rosbife, queijo derretido, tomate e picles. Clássico irresistível!",
        price: 19.90,
        image_url: "/products/bauru.jpg",
        is_available: true,
        preparation_time: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "snack-6",
        restaurant_id: "2",
        category_id: "burger",
        name: "X-Frango Crocante",
        description: "Frango empanado crocante, queijo, alface, tomate e maionese temperada.",
        price: 22.90,
        image_url: "/products/x-frango.jpg",
        is_available: true,
        preparation_time: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "snack-7",
        restaurant_id: "2",
        category_id: "burger",
        name: "Hambúrguer Vegano",
        description: "Hambúrguer de grão-de-bico, queijo vegano, alface, tomate e molho especial.",
        price: 24.90,
        image_url: "/products/burger-vegano.jpg",
        is_available: true,
        preparation_time: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "snack-8",
        restaurant_id: "2",
        category_id: "burger",
        name: "X-Salada Premium",
        description: "Hambúrguer artesanal, queijo, alface, tomate, cebola roxa e molho da casa.",
        price: 21.90,
        image_url: "/products/x-salada.jpg",
        is_available: true,
        preparation_time: 18,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

export default function LanchesPage() {
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
                        <h1 className="text-lg font-bold font-heading">Lanches</h1>

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
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white shadow-lg">
                    <div className="relative z-10 max-w-md space-y-2">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-2 text-white">
                            Sabor Irresistível
                        </span>
                        <h2 className="text-3xl font-bold font-heading">
                            Os Melhores Lanches <br /> da Cidade!
                        </h2>
                        <p className="text-white/90 text-sm md:text-base max-w-sm">
                            Hambúrgueres artesanais, cachorros-quentes e muito mais. Feitos com ingredientes frescos!
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent transform skew-x-12 translate-x-1/2"></div>
                    <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 rotate-12 select-none">
                        🍔
                    </div>
                    <div className="absolute top-4 right-10 text-4xl opacity-20 animate-bounce select-none delay-700">
                        🌭
                    </div>
                </div>

                {/* Product List */}
                <section>
                    <h3 className="text-lg font-semibold font-heading mb-4">Nossos Lanches</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {snackProducts.map((product) => (
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
