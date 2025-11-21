"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, DollarSign } from "lucide-react";
import { Card } from "./card";
import { Badge } from "./badge";
import { cn, formatCurrency, formatDistance } from "@/lib/utils";
import { RestaurantWithDistance } from "@/types";

interface RestaurantCardProps {
    restaurant: RestaurantWithDistance;
    className?: string;
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
    return (
        <Link href={`/restaurant/${restaurant.id}`}>
            <Card
                variant="outlined"
                padding="none"
                hoverable
                className={cn("overflow-hidden", className)}
            >
                <div className="relative h-32 w-full bg-neutral-200 dark:bg-neutral-800">
                    <Image
                        src={restaurant.cover_image || "/placeholder-restaurant.jpg"}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                    />
                    {!restaurant.is_open && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Badge variant="error">Fechado</Badge>
                        </div>
                    )}
                </div>

                <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-base font-heading line-clamp-1">
                            {restaurant.name}
                        </h3>
                        {restaurant.isFavorite && (
                            <span className="text-red-500">❤️</span>
                        )}
                    </div>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1">
                        {restaurant.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 text-secondary-600 dark:text-secondary-400">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
                        </div>

                        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                            <Clock className="h-4 w-4" />
                            <span>{restaurant.delivery_time} min</span>
                        </div>

                        {restaurant.distance !== undefined && (
                            <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                                <span>{formatDistance(restaurant.distance)}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1 text-accent-600 dark:text-accent-400">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatCurrency(restaurant.delivery_fee)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Badge size="sm" variant="default">
                            {restaurant.category}
                        </Badge>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
