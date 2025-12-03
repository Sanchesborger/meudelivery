"use client";

import { useState, useEffect } from "react";
import { Heart, Loader2, Star, Clock, Bike } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

// Placeholder - will be replaced with real data
const mockFavorites = [
    {
        id: "1",
        name: "Pizza Delícia",
        description: "As melhores pizzas da região",
        rating: 4.8,
        deliveryTime: 30,
        deliveryFee: 5.99,
    },
    {
        id: "3",
        name: "Sushi Master",
        description: "Culinária japonesa autêntica",
        rating: 4.9,
        deliveryTime: 40,
        deliveryFee: 7.99,
    },
];

export default function FavoritesPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState(mockFavorites);

    useEffect(() => {
        // TODO: Load real favorites from Supabase
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    const handleRemoveFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(favorites.filter(f => f.id !== id));
        // TODO: Remove from Supabase
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 bg-neutral-50 dark:bg-neutral-950">
            <Header title="Favoritos" showBack />

            <div className="container mx-auto px-4 py-6">
                {favorites.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex p-6 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
                            <Heart className="h-12 w-12 text-neutral-400 dark:text-neutral-600" />
                        </div>
                        <h3 className="text-xl font-semibold font-heading mb-2">
                            Nenhum favorito ainda
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Favorite seus restaurantes preferidos para acessá-los rapidamente
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {favorites.map((restaurant) => (
                            <Card
                                key={restaurant.id}
                                padding="none"
                                className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                                onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                            >
                                {/* Cover Image */}
                                <div className="relative h-32 bg-gradient-to-br from-primary-400 to-primary-600" />

                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold font-heading text-lg mb-1">
                                                {restaurant.name}
                                            </h3>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1">
                                                {restaurant.description}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleRemoveFavorite(restaurant.id, e)}
                                            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                            aria-label="Remover dos favoritos"
                                        >
                                            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-medium">{restaurant.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                                            <Clock className="h-4 w-4" />
                                            <span>{restaurant.deliveryTime} min</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                                            <Bike className="h-4 w-4" />
                                            <span>{formatCurrency(restaurant.deliveryFee)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
