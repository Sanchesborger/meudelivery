"use client";

import { useState } from "react";
import { Search, MapPin, Star, Clock, DollarSign, MapPinned, Bike, LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PromoCarousel } from "@/components/home/promo-carousel";

// Mock data for restaurants
const mockRestaurants = [
    {
        id: "1",
        name: "Pizza Delícia",
        description: "As melhores pizzas da região",
        category: "pizza",
        rating: 4.8,
        totalReviews: 234,
        deliveryTime: 30,
        deliveryFee: 5.99,
        distance: 1.2,
        coverImage: "/restaurants/pizza-cover.jpg",
        logoImage: "/restaurants/pizza-logo.jpg",
        isOpen: true,
    },
    {
        id: "2",
        name: "Burger House",
        description: "Hambúrgueres artesanais",
        category: "burger",
        rating: 4.6,
        totalReviews: 189,
        deliveryTime: 25,
        deliveryFee: 4.99,
        distance: 0.8,
        coverImage: "/restaurants/burger-cover.jpg",
        logoImage: "/restaurants/burger-logo.jpg",
        isOpen: true,
    },
    {
        id: "3",
        name: "Sushi Master",
        description: "Culinária japonesa autêntica",
        category: "japanese",
        rating: 4.9,
        totalReviews: 312,
        deliveryTime: 40,
        deliveryFee: 7.99,
        distance: 2.5,
        coverImage: "/restaurants/sushi-cover.jpg",
        logoImage: "/restaurants/sushi-logo.jpg",
        isOpen: true,
    },
    {
        id: "4",
        name: "Pasta Italia",
        description: "Massas tradicionais italianas",
        category: "italian",
        rating: 4.7,
        totalReviews: 156,
        deliveryTime: 35,
        deliveryFee: 6.99,
        distance: 1.8,
        coverImage: "/restaurants/pasta-cover.jpg",
        logoImage: "/restaurants/pasta-logo.jpg",
        isOpen: false,
    },
];

const categories = [
    {
        id: "restaurant",
        name: "Restaurante",
        icon: <Image src="/icons/restaurant.png" alt="Restaurante" width={40} height={40} className="object-contain drop-shadow-sm" />,
        bgColor: "bg-red-50",
        borderColor: "border-red-100",
        iconBg: "bg-white",
        iconColor: "text-red-700"
    },
    {
        id: "pizza",
        name: "Pizza",
        icon: <Image src="/icons/pizza.png" alt="Pizza" width={40} height={40} className="object-contain drop-shadow-sm" />,
        bgColor: "bg-orange-50",
        borderColor: "border-orange-100",
        iconBg: "bg-white",
        iconColor: "text-orange-700"
    },
    {
        id: "burger",
        name: "Hambúrguer",
        icon: <Image src="/icons/burger.png" alt="Hambúrguer" width={40} height={40} className="object-contain drop-shadow-sm" />,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-100",
        iconBg: "bg-white",
        iconColor: "text-yellow-700"
    },
    {
        id: "japanese",
        name: "Japonesa",
        icon: <Image src="/icons/japanese.png" alt="Japonesa" width={40} height={40} className="object-contain drop-shadow-sm" />,
        bgColor: "bg-red-50",
        borderColor: "border-red-100",
        iconBg: "bg-white",
        iconColor: "text-red-700"
    },
    {
        id: "dessert",
        name: "Sobremesas",
        icon: <Image src="/icons/dessert.png" alt="Sobremesas" width={40} height={40} className="object-contain drop-shadow-sm" />,
        bgColor: "bg-pink-50",
        borderColor: "border-pink-100",
        iconBg: "bg-white",
        iconColor: "text-pink-700"
    },
    {
        id: "healthy",
        name: "Saudável",
        icon: <Image src="/icons/healthy.png" alt="Saudável" width={40} height={40} className="object-contain drop-shadow-sm" />,
        bgColor: "bg-green-50",
        borderColor: "border-green-100",
        iconBg: "bg-white",
        iconColor: "text-green-700"
    },
    {
        id: "drinks",
        name: "Bebidas",
        icon: <Image src="/icons/drinks.png" alt="Bebidas" width={40} height={40} className="object-contain drop-shadow-sm" />,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-100",
        iconBg: "bg-white",
        iconColor: "text-blue-700"
    },
    {
        id: "all",
        name: "Todos",
        icon: <LayoutGrid className="w-8 h-8 text-neutral-600" />,
        bgColor: "bg-gray-50",
        borderColor: "border-gray-100",
        iconBg: "bg-white",
        iconColor: "text-gray-700"
    },
];

export default function HomePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const featuredRestaurants = [...mockRestaurants]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
    const filteredRestaurants = mockRestaurants.filter((restaurant) => {
        const matchesSearch = restaurant.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) || restaurant.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" ||
            restaurant.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen pb-20 bg-neutral-50 dark:bg-neutral-950">
            {/* Header with Address */}
            <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 space-y-4">
                    {/* Address */}
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary-600 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">Entregar em</p>
                            <p className="font-semibold text-sm">Rua Exemplo, 123</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Buscar restaurantes ou pratos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:border-primary-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Promotional Banner */}
                <PromoCarousel />

                {/* Categories */}
                <section>
                    <h3 className="text-lg font-semibold font-heading mb-4">Categorias</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {categories.map((category) => {
                            const isActive = selectedCategory === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${isActive
                                        ? "bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800"
                                        : `${category.bgColor} ${category.borderColor} hover:brightness-95 dark:bg-neutral-900 dark:border-neutral-800`
                                        }`}
                                >
                                    <div className={`p-2.5 rounded-xl ${isActive
                                        ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                                        : "bg-white text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 shadow-sm"
                                        }`}>
                                        {category.icon}
                                    </div>
                                    <span className={`text-[10px] font-medium truncate w-full text-center ${isActive
                                        ? "text-primary-700 dark:text-primary-300"
                                        : "text-neutral-600 dark:text-neutral-400"
                                        }`}>
                                        {category.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Featured Restaurants */}
                <section>
                    <h3 className="text-lg font-semibold font-heading mb-4">Restaurantes em destaque</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        {featuredRestaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="min-w-[280px] md:min-w-[320px] rounded-xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-neutral-900"
                                onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                            >
                                <div className="relative h-32 w-full bg-gradient-to-br from-primary-400 to-primary-600">
                                    {!restaurant.isOpen && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Badge variant="error">Fechado</Badge>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-semibold font-heading text-base">
                                            {restaurant.name}
                                        </h3>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm">{restaurant.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {restaurant.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 text-sm">
                                        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                                            <Clock className="h-4 w-4" />
                                            <span>{restaurant.deliveryTime}-{restaurant.deliveryTime + 10} min</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                                            <DollarSign className="h-4 w-4" />
                                            <span>{formatCurrency(restaurant.deliveryFee)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>


                {/* Restaurants */}
                <section>
                    <h3 className="text-lg font-semibold font-heading mb-4">
                        O que vai Pedir Hoje?
                    </h3>
                    <div className="flex flex-col gap-4">
                        {filteredRestaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="flex gap-4 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-md transition-all cursor-pointer"
                                onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                            >
                                {/* Cover Image */}
                                <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
                                    {!restaurant.isOpen && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Badge variant="error" className="text-[10px] px-1.5 py-0.5">Fechado</Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col justify-between py-0.5">
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold font-heading text-base line-clamp-1">
                                                {restaurant.name}
                                            </h3>
                                            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded text-xs font-medium text-green-700 dark:text-green-400">
                                                <span className="text-[10px]">{restaurant.rating}</span>
                                                <Star className="h-3 w-3 fill-current" />
                                            </div>
                                        </div>

                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                            {restaurant.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{restaurant.deliveryTime} min</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Bike className="h-3 w-3" />
                                                <span>{formatCurrency(restaurant.deliveryFee)}</span>
                                            </div>
                                        </div>

                                        <button className="text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
                                            VER
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredRestaurants.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-neutral-500">
                                Nenhum restaurante encontrado
                            </p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
