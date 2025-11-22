"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Clock, DollarSign, Heart, MapPin } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { MenuCategoryTabs, MenuCategory } from "@/components/restaurant/menu-category-tabs";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { mockRestaurant, mockMenuItems } from "@/lib/mock-data";

export default function RestaurantPage() {
    const params = useParams();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");
    const { items } = useCart();

    // Generate categories from menu items
    const categories: MenuCategory[] = useMemo(() => {
        const categoryMap = new Map<string, number>();

        mockMenuItems.forEach((item) => {
            const current = categoryMap.get(item.category_id) || 0;
            categoryMap.set(item.category_id, current + 1);
        });

        const cats: MenuCategory[] = [
            { id: "all", name: "Todos", count: mockMenuItems.length },
        ];

        categoryMap.forEach((count, id) => {
            const name = id === "pizzas" ? "Pizzas" :
                id === "drinks" ? "Bebidas" :
                    id === "desserts" ? "Sobremesas" : id;
            cats.push({ id, name, count });
        });

        return cats;
    }, []);

    // Filter items by category
    const filteredItems = useMemo(() => {
        if (activeCategory === "all") return mockMenuItems;
        return mockMenuItems.filter((item) => item.category_id === activeCategory);
    }, [activeCategory]);

    const handleProductClick = (productId: string) => {
        router.push(`/restaurant/${params.id}/product/${productId}`);
    };

    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen pb-32">
            <Header
                showBack
                showCart
                transparent
                rightAction={
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm"
                    >
                        <Heart
                            className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-neutral-700"
                                }`}
                        />
                    </button>
                }
            />

            {/* Cover Image */}
            <div className="relative h-48 w-full bg-neutral-200 dark:bg-neutral-800 -mt-16">
                <Image
                    src={mockRestaurant.cover_image}
                    alt={mockRestaurant.name}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Restaurant Info */}
            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
                            <Image
                                src={mockRestaurant.logo_image}
                                alt={mockRestaurant.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold font-heading mb-1">
                                {mockRestaurant.name}
                            </h1>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                {mockRestaurant.description}
                            </p>
                            <Badge variant="success" size="sm">
                                Aberto
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-secondary-600">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-medium">{mockRestaurant.rating}</span>
                            <span className="text-neutral-500">
                                ({mockRestaurant.total_reviews})
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                            <Clock className="h-4 w-4" />
                            <span>{mockRestaurant.delivery_time} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-accent-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatCurrency(mockRestaurant.delivery_fee)}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{mockRestaurant.address}</span>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="sticky top-16 z-30 mt-6">
                <MenuCategoryTabs
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />
            </div>

            {/* Menu */}
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-xl font-bold font-heading mb-4">
                    {activeCategory === "all" ? "Cardápio" : categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <div className="space-y-3">
                    {filteredItems.map((item) => (
                        <ProductCard
                            key={item.id}
                            product={item}
                            onAdd={() => handleProductClick(item.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
