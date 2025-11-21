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
import { ProductModal } from "@/components/restaurant/product-modal";
import { ExtraGroupData } from "@/components/restaurant/product-extras-group";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { PRODUCT_SIZES } from "@/lib/constants";
import { MenuItem } from "@/types";

// Mock data
const mockRestaurant = {
    id: "1",
    name: "Pizza Delícia",
    description: "As melhores pizzas da região com ingredientes frescos",
    category: "Pizza",
    cover_image: "/restaurants/pizza-cover.jpg",
    logo_image: "/restaurants/pizza-logo.jpg",
    rating: 4.8,
    total_reviews: 234,
    delivery_time: 30,
    delivery_fee: 5.99,
    min_order_value: 20,
    latitude: -23.5505,
    longitude: -46.6333,
    address: "Rua das Pizzas, 123 - Centro",
    phone: "(11) 98765-4321",
    is_open: true,
    opening_hours: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

const mockMenuItems: MenuItem[] = [
    {
        id: "1",
        restaurant_id: "1",
        category_id: "pizzas",
        name: "Pizza Margherita",
        description: "Molho de tomate, mussarela, manjericão fresco",
        price: 45.90,
        image_url: "/menu/margherita.jpg",
        is_available: true,
        preparation_time: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "2",
        restaurant_id: "1",
        category_id: "pizzas",
        name: "Pizza Calabresa",
        description: "Calabresa, cebola, azeitonas, mussarela",
        price: 48.90,
        image_url: "/menu/calabresa.jpg",
        is_available: true,
        preparation_time: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "3",
        restaurant_id: "1",
        category_id: "pizzas",
        name: "Pizza Quatro Queijos",
        description: "Mussarela, provolone, gorgonzola, parmesão",
        price: 52.90,
        image_url: "/menu/quatro-queijos.jpg",
        is_available: true,
        preparation_time: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "4",
        restaurant_id: "1",
        category_id: "drinks",
        name: "Coca-Cola 2L",
        description: "Refrigerante Coca-Cola 2 litros gelado",
        price: 12.00,
        image_url: "/menu/coca-cola.jpg",
        is_available: true,
        preparation_time: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "5",
        restaurant_id: "1",
        category_id: "desserts",
        name: "Pudim de Leite",
        description: "Pudim caseiro cremoso com calda de caramelo",
        price: 15.90,
        image_url: "/menu/pudim.jpg",
        is_available: true,
        preparation_time: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

// Mock extra groups for pizzas
const mockExtraGroups: ExtraGroupData[] = [
    {
        id: "crust",
        name: "Tipo de Borda",
        required: false,
        minSelection: 0,
        maxSelection: 1,
        extras: [
            { id: "crust-1", name: "Borda Catupiry", price: 8.00 },
            { id: "crust-2", name: "Borda Cheddar", price: 7.00 },
            { id: "crust-3", name: "Borda Chocolate", price: 6.00 },
        ],
    },
    {
        id: "extras",
        name: "Adicionais",
        required: false,
        minSelection: 0,
        maxSelection: 3,
        extras: [
            { id: "extra-1", name: "Bacon", price: 5.00 },
            { id: "extra-2", name: "Azeitona", price: 3.00 },
            { id: "extra-3", name: "Orégano Extra", price: 1.00 },
            { id: "extra-4", name: "Parmesão Ralado", price: 2.00 },
        ],
    },
];

export default function RestaurantPage() {
    const params = useParams();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const { addItem, items, total } = useCart();

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

    const handleProductClick = (product: MenuItem) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const handleAddToCart = (data: {
        product: MenuItem;
        quantity: number;
        selectedSize?: string;
        selectedExtras: string[];
        notes: string;
    }) => {
        // In real app, would create cart item with all data
        // For now, simplified version
        addItem(data.product, data.quantity, data.notes);
    };

    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Determine if product should show extras (pizzas only for now)
    const getProductExtras = (product: MenuItem) => {
        if (product.category_id === "pizzas") {
            return mockExtraGroups;
        }
        return [];
    };

    const getProductSizes = (product: MenuItem) => {
        if (product.category_id === "pizzas") {
            return PRODUCT_SIZES.map((size) => ({
                id: size.id,
                name: size.name,
                priceMultiplier: size.multiplier,
            }));
        }
        return [];
    };

    return (
        <div className="min-h-screen pb-32">
            <Header
                showBack
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
                            onAdd={() => handleProductClick(item)}
                        />
                    ))}
                </div>
            </div>

            {/* Floating Cart Button */}
            {cartItemCount > 0 && (
                <div className="fixed bottom-20 left-0 right-0 z-40 px-4 safe-bottom">
                    <Button
                        fullWidth
                        size="lg"
                        className="shadow-2xl"
                        onClick={() => router.push("/cart")}
                    >
                        <span className="flex items-center justify-between w-full">
                            <span className="flex items-center gap-2">
                                <span className="bg-white/20 rounded-full px-2 py-0.5 text-sm font-bold">
                                    {cartItemCount}
                                </span>
                                Ver carrinho
                            </span>
                            <span className="font-bold">{formatCurrency(total)}</span>
                        </span>
                    </Button>
                </div>
            )}

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                open={showProductModal}
                onClose={() => setShowProductModal(false)}
                onAddToCart={handleAddToCart}
                extraGroups={selectedProduct ? getProductExtras(selectedProduct) : []}
                sizes={selectedProduct ? getProductSizes(selectedProduct) : []}
            />
        </div>
    );
}
