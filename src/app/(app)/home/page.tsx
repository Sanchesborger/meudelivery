"use client";

import { useState } from "react";
import { Search, MapPin, Star, Clock, DollarSign, MapPinned, Bike, LayoutGrid, ShoppingBag, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { useCart } from "@/hooks/use-cart";
import { useGeolocation } from "@/hooks/use-geolocation";

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
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={48} height={48} className="drop-shadow-xl">
                <defs>
                    <linearGradient id="cloche-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E8E8E8" />
                        <stop offset="50%" stopColor="#F8F8F8" />
                        <stop offset="100%" stopColor="#D0D0D0" />
                    </linearGradient>
                    <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#C0C0C0" />
                        <stop offset="50%" stopColor="#E0E0E0" />
                        <stop offset="100%" stopColor="#A0A0A0" />
                    </linearGradient>
                    <filter id="shadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                </defs>
                {/* Base shadow */}
                <ellipse cx="40" cy="68" rx="24" ry="5" fill="#000" opacity="0.15" />
                {/* Cloche base */}
                <ellipse cx="40" cy="62" rx="24" ry="6" fill="url(#metal-gradient)" filter="url(#shadow)" />
                {/* Cloche body */}
                <path d="M 16 62 Q 16 32 40 32 Q 64 32 64 62 Z" fill="url(#cloche-shine)" filter="url(#shadow)" />
                {/* Shine effect */}
                <ellipse cx="35" cy="42" rx="12" ry="8" fill="#FFF" opacity="0.4" />
                {/* Handle base */}
                <ellipse cx="40" cy="30" rx="5" ry="2" fill="#B0B0B0" />
                {/* Handle */}
                <circle cx="40" cy="26" r="4" fill="url(#metal-gradient)" filter="url(#shadow)" />
                <circle cx="40" cy="25" r="3" fill="#D0D0D0" />
                {/* Fork */}
                <g transform="translate(-8, 0)">
                    <rect x="12" y="48" width="2.5" height="20" rx="1" fill="url(#metal-gradient)" filter="url(#shadow)" />
                    <rect x="10" y="46" width="1.8" height="12" rx="0.8" fill="#B0B0B0" />
                    <rect x="12.5" y="46" width="1.8" height="12" rx="0.8" fill="#B0B0B0" />
                    <rect x="15" y="46" width="1.8" height="12" rx="0.8" fill="#B0B0B0" />
                </g>
                {/* Knife */}
                <g transform="translate(8, 0)">
                    <rect x="65" y="48" width="2.5" height="20" rx="1" fill="url(#metal-gradient)" filter="url(#shadow)" />
                    <path d="M 65 46 L 65 54 L 67.5 51 L 67.5 46 Z" fill="#D8D8D8" filter="url(#shadow)" />
                </g>
            </svg>
        ),
        bgColor: "bg-rose-50/50",
        borderColor: "border-transparent",
        iconBg: "bg-white",
        iconColor: "text-red-700"
    },
    {
        id: "pizza",
        name: "Pizza",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={48} height={48} className="drop-shadow-xl">
                <defs>
                    <linearGradient id="crust-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E8A865" />
                        <stop offset="50%" stopColor="#D4915A" />
                        <stop offset="100%" stopColor="#C17D48" />
                    </linearGradient>
                    <linearGradient id="cheese-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE55C" />
                        <stop offset="50%" stopColor="#FFD93D" />
                        <stop offset="100%" stopColor="#FFC107" />
                    </linearGradient>
                    <radialGradient id="pepperoni-gradient">
                        <stop offset="0%" stopColor="#E63946" />
                        <stop offset="70%" stopColor="#C1121F" />
                        <stop offset="100%" stopColor="#9D0208" />
                    </radialGradient>
                    <filter id="pizza-shadow">
                        <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.35" />
                    </filter>
                </defs>
                {/* Shadow */}
                <ellipse cx="40" cy="72" rx="28" ry="4" fill="#000" opacity="0.2" />
                {/* Pizza crust */}
                <path d="M 40 12 L 12 68 L 68 68 Z" fill="url(#crust-gradient)" filter="url(#pizza-shadow)" />
                {/* Cheese layer */}
                <path d="M 40 18 L 16 64 L 64 64 Z" fill="url(#cheese-gradient)" />
                {/* Cheese shine */}
                <path d="M 40 18 L 30 40 L 50 40 Z" fill="#FFF" opacity="0.3" />
                {/* Pepperoni slices */}
                <circle cx="34" cy="36" r="5" fill="url(#pepperoni-gradient)" />
                <circle cx="34" cy="36" r="4" fill="#C1121F" />
                <ellipse cx="33" cy="35" rx="2" ry="1.5" fill="#E63946" opacity="0.6" />

                <circle cx="46" cy="42" r="5" fill="url(#pepperoni-gradient)" />
                <circle cx="46" cy="42" r="4" fill="#C1121F" />
                <ellipse cx="45" cy="41" rx="2" ry="1.5" fill="#E63946" opacity="0.6" />

                <circle cx="40" cy="52" r="5" fill="url(#pepperoni-gradient)" />
                <circle cx="40" cy="52" r="4" fill="#C1121F" />
                <ellipse cx="39" cy="51" rx="2" ry="1.5" fill="#E63946" opacity="0.6" />

                <circle cx="28" cy="50" r="4.5" fill="url(#pepperoni-gradient)" />
                <circle cx="28" cy="50" r="3.5" fill="#C1121F" />

                <circle cx="52" cy="56" r="4.5" fill="url(#pepperoni-gradient)" />
                <circle cx="52" cy="56" r="3.5" fill="#C1121F" />
                {/* Cheese drips */}
                <path d="M 20 68 Q 18 71 20 73 L 22 73 Q 24 71 22 68 Z" fill="url(#cheese-gradient)" />
                <path d="M 40 68 Q 38 72 40 74 L 42 74 Q 44 72 42 68 Z" fill="url(#cheese-gradient)" />
                <path d="M 60 68 Q 58 71 60 73 L 62 73 Q 64 71 62 68 Z" fill="url(#cheese-gradient)" />
            </svg>
        ),
        bgColor: "bg-orange-50/50",
        borderColor: "border-transparent",
        iconBg: "bg-white",
        iconColor: "text-orange-700"
    },
    {
        id: "burger",
        name: "Hambúrguer",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={48} height={48} className="drop-shadow-xl">
                <defs>
                    <linearGradient id="top-bun" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F5C98B" />
                        <stop offset="50%" stopColor="#E8B574" />
                        <stop offset="100%" stopColor="#D4A05E" />
                    </linearGradient>
                    <linearGradient id="bottom-bun" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E8B574" />
                        <stop offset="100%" stopColor="#C99A5A" />
                    </linearGradient>
                    <linearGradient id="patty" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B5A3C" />
                        <stop offset="50%" stopColor="#6F4E37" />
                        <stop offset="100%" stopColor="#5C3D2E" />
                    </linearGradient>
                    <linearGradient id="cheese" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFE55C" />
                        <stop offset="50%" stopColor="#FFD93D" />
                        <stop offset="100%" stopColor="#FFC107" />
                    </linearGradient>
                    <filter id="burger-shadow">
                        <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.35" />
                    </filter>
                </defs>
                {/* Shadow */}
                <ellipse cx="40" cy="72" rx="26" ry="4" fill="#000" opacity="0.2" />
                {/* Top bun */}
                <ellipse cx="40" cy="28" rx="22" ry="10" fill="url(#top-bun)" filter="url(#burger-shadow)" />
                <path d="M 18 28 Q 18 20 40 20 Q 62 20 62 28" fill="#F5C98B" />
                {/* Shine on bun */}
                <ellipse cx="35" cy="24" rx="10" ry="4" fill="#FFF" opacity="0.3" />
                {/* Sesame seeds */}
                <circle cx="28" cy="22" r="1.5" fill="#FFF8DC" />
                <circle cx="35" cy="21" r="1.5" fill="#FFF8DC" />
                <circle cx="42" cy="21" r="1.5" fill="#FFF8DC" />
                <circle cx="49" cy="22" r="1.5" fill="#FFF8DC" />
                <circle cx="32" cy="25" r="1.3" fill="#FFF8DC" />
                <circle cx="46" cy="25" r="1.3" fill="#FFF8DC" />
                {/* Lettuce */}
                <path d="M 16 36 Q 18 34 22 34 Q 26 35 30 34 Q 34 33 38 34 Q 42 35 46 34 Q 50 33 54 34 Q 58 34 62 36 L 60 38 Q 56 37 52 38 Q 48 39 44 38 Q 40 37 36 38 Q 32 39 28 38 Q 24 37 20 38 Q 18 38 16 38 Z" fill="#7CB342" />
                <path d="M 18 36 Q 20 35 24 35 Q 28 36 32 35 Q 36 34 40 35 Q 44 36 48 35 Q 52 34 56 35 Q 58 35 60 36" fill="#9CCC65" opacity="0.7" />
                {/* Tomato */}
                <ellipse cx="40" cy="42" rx="21" ry="3" fill="#E53935" />
                <ellipse cx="40" cy="41" rx="20" ry="2" fill="#FF5252" opacity="0.6" />
                {/* Cheese */}
                <path d="M 16 46 L 64 46 L 62 50 L 18 50 Z" fill="url(#cheese)" filter="url(#burger-shadow)" />
                <path d="M 16 46 L 64 46 L 62 48 L 18 48 Z" fill="#FFE55C" opacity="0.5" />
                {/* Patty */}
                <ellipse cx="40" cy="56" rx="22" ry="5" fill="url(#patty)" filter="url(#burger-shadow)" />
                <ellipse cx="40" cy="55" rx="21" ry="4" fill="#8B5A3C" />
                {/* Grill marks */}
                <rect x="25" y="54" width="30" height="1" rx="0.5" fill="#5C3D2E" opacity="0.6" />
                <rect x="27" y="57" width="26" height="1" rx="0.5" fill="#5C3D2E" opacity="0.6" />
                {/* Bottom bun */}
                <ellipse cx="40" cy="64" rx="22" ry="8" fill="url(#bottom-bun)" filter="url(#burger-shadow)" />
                <ellipse cx="40" cy="63" rx="21" ry="6" fill="#E8B574" />
                {/* Flag */}
                <rect x="38" y="10" width="1.5" height="14" fill="#8B4513" />
                <path d="M 39.5 10 L 39.5 16 L 48 13 Z" fill="#E53935" filter="url(#burger-shadow)" />
                <path d="M 39.5 10 L 39.5 16 L 48 13 Z" fill="#FF5252" opacity="0.5" />
            </svg>
        ),
        bgColor: "bg-amber-50/50",
        borderColor: "border-transparent",
        iconBg: "bg-white",
        iconColor: "text-yellow-700"
    },
    {
        id: "japanese",
        name: "Japonesa",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={48} height={48} className="drop-shadow-xl">
                <defs>
                    <linearGradient id="wood-board" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C19A6B" />
                        <stop offset="50%" stopColor="#A67C52" />
                        <stop offset="100%" stopColor="#8B6F47" />
                    </linearGradient>
                    <radialGradient id="rice-gradient">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#F5F5F5" />
                    </radialGradient>
                    <linearGradient id="salmon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF9A8B" />
                        <stop offset="50%" stopColor="#FF6A88" />
                        <stop offset="100%" stopColor="#FF5470" />
                    </linearGradient>
                    <filter id="sushi-shadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                </defs>
                {/* Shadow */}
                <ellipse cx="40" cy="72" rx="32" ry="4" fill="#000" opacity="0.15" />
                {/* Wooden board */}
                <rect x="8" y="36" width="64" height="32" rx="4" fill="url(#wood-board)" filter="url(#sushi-shadow)" />
                {/* Wood texture lines */}
                <line x1="10" y1="42" x2="70" y2="42" stroke="#8B6F47" strokeWidth="0.5" opacity="0.3" />
                <line x1="10" y1="52" x2="70" y2="52" stroke="#8B6F47" strokeWidth="0.5" opacity="0.3" />
                <line x1="10" y1="62" x2="70" y2="62" stroke="#8B6F47" strokeWidth="0.5" opacity="0.3" />
                {/* Sushi roll 1 - Tuna */}
                <circle cx="24" cy="46" r="7" fill="url(#rice-gradient)" filter="url(#sushi-shadow)" />
                <circle cx="24" cy="46" r="5.5" fill="#2C3E50" />
                <circle cx="24" cy="46" r="3" fill="#E74C3C" />
                <ellipse cx="23" cy="45" rx="1.5" ry="1" fill="#FF6B6B" opacity="0.6" />
                {/* Sushi roll 2 - Salmon */}
                <circle cx="40" cy="46" r="7" fill="url(#rice-gradient)" filter="url(#sushi-shadow)" />
                <circle cx="40" cy="46" r="5.5" fill="#2C3E50" />
                <circle cx="40" cy="46" r="3" fill="url(#salmon-gradient)" />
                <ellipse cx="39" cy="45" rx="1.5" ry="1" fill="#FFA8A8" opacity="0.6" />
                {/* Sushi roll 3 - Avocado */}
                <circle cx="56" cy="46" r="7" fill="url(#rice-gradient)" filter="url(#sushi-shadow)" />
                <circle cx="56" cy="46" r="5.5" fill="#2C3E50" />
                <circle cx="56" cy="46" r="3" fill="#52B788" />
                <ellipse cx="55" cy="45" rx="1.5" ry="1" fill="#74C69D" opacity="0.6" />
                {/* Nigiri */}
                <ellipse cx="24" cy="58" rx="7" ry="4" fill="url(#rice-gradient)" filter="url(#sushi-shadow)" />
                <path d="M 17 58 Q 17 54 24 53 Q 31 54 31 58" fill="url(#salmon-gradient)" />
                <path d="M 19 56 Q 19 54 24 53.5 Q 29 54 29 56" fill="#FF9A8B" opacity="0.5" />
                {/* Wasabi */}
                <ellipse cx="46" cy="60" rx="4" ry="3" fill="#52B788" filter="url(#sushi-shadow)" />
                <ellipse cx="46" cy="59" rx="3" ry="2" fill="#74C69D" />
                {/* Ginger */}
                <path d="M 58 58 Q 56 56 60 56 Q 64 56 62 58 Q 64 60 60 60 Q 56 60 58 58" fill="#FFB3BA" filter="url(#sushi-shadow)" />
                <path d="M 59 57 Q 58 56 60 56 Q 62 56 61 57" fill="#FFC9CE" opacity="0.6" />
            </svg>
        ),
        bgColor: "bg-red-50/50",
        borderColor: "border-transparent",
        iconBg: "bg-white",
        iconColor: "text-red-700"
    },
    {
        id: "dessert",
        name: "Sobremesas",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={48} height={48} className="drop-shadow-xl">
                <defs>
                    <linearGradient id="cone-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E8B574" />
                        <stop offset="50%" stopColor="#D4A05E" />
                        <stop offset="100%" stopColor="#C18A48" />
                    </linearGradient>
                    <radialGradient id="vanilla-gradient">
                        <stop offset="0%" stopColor="#FFFACD" />
                        <stop offset="100%" stopColor="#FFF8DC" />
                    </radialGradient>
                    <radialGradient id="strawberry-gradient">
                        <stop offset="0%" stopColor="#FFB3D9" />
                        <stop offset="70%" stopColor="#FF8DC7" />
                        <stop offset="100%" stopColor="#FF69B4" />
                    </radialGradient>
                    <radialGradient id="cream-gradient">
                        <stop offset="0%" stopColor="#FFFEF7" />
                        <stop offset="100%" stopColor="#FFF8E7" />
                    </radialGradient>
                    <filter id="ice-shadow">
                        <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.3" />
                    </filter>
                </defs>
                {/* Shadow */}
                <ellipse cx="40" cy="74" rx="18" ry="3" fill="#000" opacity="0.2" />
                {/* Cone */}
                <path d="M 32 44 L 24 72 L 56 72 L 48 44 Z" fill="url(#cone-gradient)" filter="url(#ice-shadow)" />
                {/* Waffle pattern */}
                <line x1="30" y1="50" x2="50" y2="50" stroke="#A0826D" strokeWidth="1" />
                <line x1="28" y1="56" x2="52" y2="56" stroke="#A0826D" strokeWidth="1" />
                <line x1="26" y1="62" x2="54" y2="62" stroke="#A0826D" strokeWidth="1" />
                <line x1="25" y1="68" x2="55" y2="68" stroke="#A0826D" strokeWidth="1" />
                <line x1="34" y1="44" x2="28" y2="72" stroke="#A0826D" strokeWidth="0.8" />
                <line x1="40" y1="44" x2="34" y2="72" stroke="#A0826D" strokeWidth="0.8" />
                <line x1="46" y1="44" x2="46" y2="72" stroke="#A0826D" strokeWidth="0.8" />
                {/* Ice cream scoop bottom - Vanilla */}
                <ellipse cx="40" cy="44" rx="15" ry="12" fill="url(#vanilla-gradient)" filter="url(#ice-shadow)" />
                <ellipse cx="38" cy="42" rx="8" ry="6" fill="#FFF" opacity="0.4" />
                {/* Ice cream scoop middle - Strawberry */}
                <ellipse cx="40" cy="34" rx="14" ry="11" fill="url(#strawberry-gradient)" filter="url(#ice-shadow)" />
                <ellipse cx="38" cy="32" rx="7" ry="5" fill="#FFD1E8" opacity="0.5" />
                {/* Ice cream scoop top - Cream */}
                <ellipse cx="40" cy="24" rx="13" ry="10" fill="url(#cream-gradient)" filter="url(#ice-shadow)" />
                <ellipse cx="38" cy="22" rx="6" ry="4" fill="#FFF" opacity="0.6" />
                {/* Sprinkles */}
                <rect x="34" y="22" width="3" height="1.5" rx="0.5" fill="#FF1744" transform="rotate(30 35.5 22.75)" />
                <rect x="44" y="24" width="3" height="1.5" rx="0.5" fill="#2979FF" transform="rotate(-20 45.5 24.75)" />
                <rect x="36" y="32" width="3" height="1.5" rx="0.5" fill="#FFD600" transform="rotate(45 37.5 32.75)" />
                <rect x="46" y="34" width="3" height="1.5" rx="0.5" fill="#00E676" transform="rotate(-30 47.5 34.75)" />
                <rect x="32" y="40" width="3" height="1.5" rx="0.5" fill="#FF6D00" transform="rotate(15 33.5 40.75)" />
                <rect x="48" y="42" width="3" height="1.5" rx="0.5" fill="#D500F9" transform="rotate(-45 49.5 42.75)" />
                <rect x="38" y="28" width="3" height="1.5" rx="0.5" fill="#00BCD4" transform="rotate(60 39.5 28.75)" />
                <rect x="42" y="38" width="3" height="1.5" rx="0.5" fill="#FF4081" transform="rotate(-60 43.5 38.75)" />
            </svg>
        ),
        bgColor: "bg-pink-50/50",
        borderColor: "border-transparent",
        iconBg: "bg-white",
        iconColor: "text-pink-700"
    },
    {
        id: "healthy",
        name: "Saudável",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={48} height={48} className="drop-shadow-xl">
                <defs>
                    <linearGradient id="bowl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F5DEB3" />
                        <stop offset="50%" stopColor="#E8D4A8" />
                        <stop offset="100%" stopColor="#D2B48C" />
                    </linearGradient>
                    <radialGradient id="lettuce-grad">
                        <stop offset="0%" stopColor="#A8E6A1" />
                        <stop offset="100%" stopColor="#7CB342" />
                    </radialGradient>
                    <radialGradient id="tomato-grad">
                        <stop offset="0%" stopColor="#FF6B6B" />
                        <stop offset="100%" stopColor="#E53935" />
                    </radialGradient>
                    <radialGradient id="avocado-grad">
                        <stop offset="0%" stopColor="#8BC34A" />
                        <stop offset="100%" stopColor="#689F38" />
                    </radialGradient>
                    <filter id="salad-shadow">
                        <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.3" />
                    </filter>
                </defs>
                {/* Shadow */}
                <ellipse cx="40" cy="72" rx="28" ry="4" fill="#000" opacity="0.2" />
                {/* Bowl */}
                <ellipse cx="40" cy="58" rx="28" ry="8" fill="url(#bowl-grad)" filter="url(#salad-shadow)" />
                <path d="M 12 58 Q 12 32 40 32 Q 68 32 68 58" fill="url(#bowl-grad)" />
                <path d="M 12 58 Q 12 32 40 32 Q 68 32 68 58" fill="#FFF" opacity="0.2" />
                {/* Bowl rim shine */}
                <ellipse cx="40" cy="32" rx="28" ry="3" fill="#FFF8DC" opacity="0.6" />
                {/* Lettuce leaves */}
                <ellipse cx="28" cy="42" rx="8" ry="7" fill="url(#lettuce-grad)" transform="rotate(-25 28 42)" filter="url(#salad-shadow)" />
                <path d="M 24 40 Q 22 42 24 44 Q 26 46 28 44 Q 30 42 28 40 Q 26 38 24 40" fill="#A8E6A1" opacity="0.6" />

                <ellipse cx="40" cy="40" rx="8" ry="7" fill="url(#lettuce-grad)" filter="url(#salad-shadow)" />
                <path d="M 36 38 Q 34 40 36 42 Q 38 44 40 42 Q 42 40 40 38 Q 38 36 36 38" fill="#A8E6A1" opacity="0.6" />

                <ellipse cx="52" cy="42" rx="8" ry="7" fill="url(#lettuce-grad)" transform="rotate(25 52 42)" filter="url(#salad-shadow)" />
                <path d="M 48 40 Q 46 42 48 44 Q 50 46 52 44 Q 54 42 52 40 Q 50 38 48 40" fill="#A8E6A1" opacity="0.6" />
                {/* Cherry tomatoes */}
                <circle cx="26" cy="48" r="4" fill="url(#tomato-grad)" filter="url(#salad-shadow)" />
                <ellipse cx="25" cy="47" rx="2" ry="1.5" fill="#FF8A80" opacity="0.6" />

                <circle cx="54" cy="48" r="4" fill="url(#tomato-grad)" filter="url(#salad-shadow)" />
                <ellipse cx="53" cy="47" rx="2" ry="1.5" fill="#FF8A80" opacity="0.6" />
                {/* Avocado */}
                <ellipse cx="40" cy="50" rx="6" ry="4" fill="url(#avocado-grad)" filter="url(#salad-shadow)" />
                <ellipse cx="40" cy="50" rx="3" ry="2" fill="#F0E68C" />
                <circle cx="40" cy="50" r="1" fill="#8B6F47" />
                {/* Cucumber slices */}
                <ellipse cx="34" cy="52" rx="4" ry="3" fill="#66BB6A" filter="url(#salad-shadow)" />
                <ellipse cx="34" cy="52" rx="3" ry="2" fill="#A5D6A7" opacity="0.7" />

                <ellipse cx="46" cy="52" rx="4" ry="3" fill="#66BB6A" filter="url(#salad-shadow)" />
                <ellipse cx="46" cy="52" rx="3" ry="2" fill="#A5D6A7" opacity="0.7" />
                {/* Carrot slices */}
                <circle cx="32" cy="46" r="2.5" fill="#FF9800" filter="url(#salad-shadow)" />
                <circle cx="48" cy="46" r="2.5" fill="#FF9800" filter="url(#salad-shadow)" />
                {/* Fork */}
                <g transform="translate(8, 0)">
                    <rect x="58" y="32" width="2.5" height="20" rx="1" fill="#C0C0C0" filter="url(#salad-shadow)" />
                    <rect x="56" y="30" width="2" height="12" rx="0.8" fill="#A8A8A8" />
                    <rect x="58.5" y="30" width="2" height="12" rx="0.8" fill="#A8A8A8" />
                    <rect x="61" y="30" width="2" height="12" rx="0.8" fill="#A8A8A8" />
                </g>
            </svg>
        ),
        bgColor: "bg-emerald-50/50",
        borderColor: "border-transparent",
        iconBg: "bg-white",
        iconColor: "text-green-700"
    },
    {
        id: "drinks",
        name: "Bebidas",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={48} height={48} className="drop-shadow-xl">
                <defs>
                    <linearGradient id="soda-can" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E53935" />
                        <stop offset="50%" stopColor="#D32F2F" />
                        <stop offset="100%" stopColor="#C62828" />
                    </linearGradient>
                    <linearGradient id="bottle-green" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#43A047" />
                        <stop offset="50%" stopColor="#388E3C" />
                        <stop offset="100%" stopColor="#2E7D32" />
                    </linearGradient>
                    <radialGradient id="liquid-shine">
                        <stop offset="0%" stopColor="#FFF" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <filter id="drink-shadow">
                        <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.35" />
                    </filter>
                </defs>
                {/* Shadow */}
                <ellipse cx="40" cy="74" rx="28" ry="3" fill="#000" opacity="0.2" />
                {/* Bottle */}
                <rect x="20" y="32" width="14" height="38" rx="2" fill="url(#bottle-green)" filter="url(#drink-shadow)" />
                <rect x="23" y="26" width="8" height="6" rx="1" fill="url(#bottle-green)" />
                <ellipse cx="27" cy="26" rx="4" ry="2" fill="#43A047" />
                <ellipse cx="27" cy="70" rx="7" ry="3" fill="#2E7D32" />
                {/* Bottle shine */}
                <rect x="22" y="34" width="4" height="32" rx="2" fill="#FFF" opacity="0.3" />
                {/* Bottle label */}
                <rect x="22" y="45" width="10" height="12" rx="1" fill="#FFF" opacity="0.7" />
                <rect x="24" y="48" width="6" height="2" fill="#2E7D32" opacity="0.5" />
                <rect x="24" y="52" width="6" height="1" fill="#2E7D32" opacity="0.5" />
                {/* Bubbles in bottle */}
                <circle cx="26" cy="38" r="1.2" fill="#FFF" opacity="0.6" />
                <circle cx="29" cy="42" r="1" fill="#FFF" opacity="0.6" />
                <circle cx="25" cy="50" r="1.2" fill="#FFF" opacity="0.6" />
                <circle cx="28" cy="60" r="1" fill="#FFF" opacity="0.6" />
                {/* Soda can */}
                <rect x="46" y="38" width="16" height="32" rx="2" fill="url(#soda-can)" filter="url(#drink-shadow)" />
                <ellipse cx="54" cy="38" rx="8" ry="3" fill="#E53935" />
                <ellipse cx="54" cy="70" rx="8" ry="3" fill="#C62828" />
                {/* Can shine */}
                <rect x="48" y="40" width="3" height="28" rx="1.5" fill="#FFF" opacity="0.4" />
                {/* Can label */}
                <rect x="47" y="48" width="14" height="6" rx="1" fill="#FFF" opacity="0.8" />
                <circle cx="54" cy="51" r="2" fill="#E53935" />
                {/* Can tab */}
                <ellipse cx="54" cy="36" rx="3" ry="1.5" fill="#BDBDBD" filter="url(#drink-shadow)" />
                <rect x="53" y="34" width="2" height="2" rx="1" fill="#E0E0E0" />
                {/* Bubbles in can */}
                <circle cx="56" cy="42" r="1" fill="#FFF" opacity="0.5" />
                <circle cx="58" cy="46" r="1.2" fill="#FFF" opacity="0.5" />
                <circle cx="57" cy="54" r="1" fill="#FFF" opacity="0.5" />
                <circle cx="59" cy="60" r="1.2" fill="#FFF" opacity="0.5" />
            </svg>
        ),
        bgColor: "bg-sky-50/50",
        borderColor: "border-transparent",
        iconBg: "bg-white",
        iconColor: "text-blue-700"
    },
    {
        id: "all",
        name: "Todos",
        icon: <LayoutGrid className="w-8 h-8 text-neutral-600" />,
        bgColor: "bg-neutral-50/50",
        borderColor: "border-transparent",
        iconBg: "bg-white",
        iconColor: "text-gray-700"
    },
];

export default function HomePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedChip, setSelectedChip] = useState("all");
    const { items } = useCart();
    const { loading: locationLoading, error: locationError, address: userAddress, requestLocation } = useGeolocation();

    const chipCategories = [
        {
            id: "all",
            label: "Todos",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
                    <defs>
                        <linearGradient id="store-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#78909C" />
                            <stop offset="100%" stopColor="#546E7A" />
                        </linearGradient>
                    </defs>
                    <rect x="6" y="12" width="20" height="14" rx="1" fill="url(#store-grad)" />
                    <path d="M 4 12 L 16 6 L 28 12" fill="#90A4AE" />
                    <rect x="12" y="16" width="4" height="6" fill="#FFF" opacity="0.3" />
                    <rect x="18" y="16" width="4" height="6" fill="#FFF" opacity="0.3" />
                </svg>
            ),
            gradient: "from-gray-500 to-gray-600"
        },
        {
            id: "promos",
            label: "Promos",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
                    <defs>
                        <linearGradient id="ticket-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                    </defs>
                    <rect x="4" y="10" width="24" height="12" rx="2" fill="url(#ticket-grad)" />
                    <circle cx="4" cy="16" r="2" fill="#FFF" />
                    <circle cx="28" cy="16" r="2" fill="#FFF" />
                    <line x1="14" y1="10" x2="14" y2="22" stroke="#FFF" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                    <path d="M 17 14 L 19 18 L 17 20" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M 11 15 L 13 17" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            gradient: "from-red-500 to-rose-600"
        },
        {
            id: "lanches",
            label: "Lanches",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
                    <defs>
                        <linearGradient id="burger-chip" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F5C98B" />
                            <stop offset="100%" stopColor="#D4A05E" />
                        </linearGradient>
                    </defs>
                    <ellipse cx="16" cy="12" rx="8" ry="3" fill="url(#burger-chip)" />
                    <ellipse cx="16" cy="15" rx="8.5" ry="1" fill="#7CB342" />
                    <ellipse cx="16" cy="17" rx="8" ry="1" fill="#E53935" />
                    <path d="M 8 18 L 24 18 L 23 20 L 9 20 Z" fill="#FFD93D" />
                    <ellipse cx="16" cy="22" rx="8" ry="2" fill="#8B5A3C" />
                    <ellipse cx="16" cy="25" rx="8" ry="3" fill="#E8B574" />
                </svg>
            ),
            gradient: "from-orange-500 to-red-500"
        },
        {
            id: "acai",
            label: "Açaí",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
                    <defs>
                        <radialGradient id="acai-grad">
                            <stop offset="0%" stopColor="#9C27B0" />
                            <stop offset="100%" stopColor="#6A1B9A" />
                        </radialGradient>
                    </defs>
                    <ellipse cx="16" cy="22" rx="9" ry="3" fill="#8E24AA" />
                    <path d="M 7 22 Q 7 12 16 12 Q 25 12 25 22" fill="url(#acai-grad)" />
                    <circle cx="14" cy="16" r="2" fill="#4A148C" />
                    <circle cx="18" cy="18" r="2" fill="#4A148C" />
                    <circle cx="16" cy="14" r="1.5" fill="#E91E63" />
                    <ellipse cx="16" cy="10" rx="2" ry="3" fill="#FFD93D" />
                </svg>
            ),
            gradient: "from-purple-500 to-pink-500"
        },
        {
            id: "padarias",
            label: "Padarias",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
                    <defs>
                        <linearGradient id="bread-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F5C98B" />
                            <stop offset="100%" stopColor="#C99A5A" />
                        </linearGradient>
                    </defs>
                    <ellipse cx="16" cy="20" rx="10" ry="4" fill="#C99A5A" />
                    <path d="M 6 20 Q 6 12 16 12 Q 26 12 26 20" fill="url(#bread-grad)" />
                    <line x1="10" y1="14" x2="10" y2="19" stroke="#D4A05E" strokeWidth="1" opacity="0.5" />
                    <line x1="14" y1="13" x2="14" y2="19" stroke="#D4A05E" strokeWidth="1" opacity="0.5" />
                    <line x1="18" y1="13" x2="18" y2="19" stroke="#D4A05E" strokeWidth="1" opacity="0.5" />
                    <line x1="22" y1="14" x2="22" y2="19" stroke="#D4A05E" strokeWidth="1" opacity="0.5" />
                </svg>
            ),
            gradient: "from-amber-500 to-yellow-600"
        },
        {
            id: "doces",
            label: "Doces & Bolos",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
                    <defs>
                        <linearGradient id="cake-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFB3D9" />
                            <stop offset="100%" stopColor="#FF69B4" />
                        </linearGradient>
                    </defs>
                    <rect x="8" y="18" width="16" height="6" rx="1" fill="url(#cake-grad)" />
                    <rect x="10" y="14" width="12" height="4" fill="#FFF8DC" />
                    <path d="M 10 14 Q 10 12 16 11 Q 22 12 22 14" fill="#FFD1E8" />
                    <rect x="15" y="8" width="2" height="3" fill="#E91E63" />
                    <ellipse cx="16" cy="8" rx="2" ry="1.5" fill="#FFD93D" />
                    <circle cx="12" cy="20" r="1" fill="#FFF" opacity="0.6" />
                    <circle cx="20" cy="21" r="1" fill="#FFF" opacity="0.6" />
                </svg>
            ),
            gradient: "from-pink-500 to-rose-500"
        },
        {
            id: "acougue",
            label: "Açougue",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
                    <defs>
                        <linearGradient id="meat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E53935" />
                            <stop offset="100%" stopColor="#C62828" />
                        </linearGradient>
                    </defs>
                    <ellipse cx="16" cy="18" rx="9" ry="6" fill="url(#meat-grad)" />
                    <ellipse cx="14" cy="16" rx="4" ry="3" fill="#FF5252" opacity="0.5" />
                    <path d="M 10 16 Q 12 14 14 16" fill="#FFF" opacity="0.3" />
                    <ellipse cx="20" cy="19" rx="3" ry="2" fill="#D32F2F" />
                    <ellipse cx="12" cy="20" rx="2.5" ry="1.5" fill="#D32F2F" />
                </svg>
            ),
            gradient: "from-red-600 to-red-700"
        },
        {
            id: "salgados",
            label: "Salgados",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
                    <defs>
                        <linearGradient id="pastry-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFD93D" />
                            <stop offset="100%" stopColor="#F4A460" />
                        </linearGradient>
                    </defs>
                    <path d="M 16 10 Q 10 12 8 16 Q 10 20 16 22 Q 22 20 24 16 Q 22 12 16 10 Z" fill="url(#pastry-grad)" />
                    <path d="M 16 12 Q 12 13 11 16 Q 12 19 16 20 Q 20 19 21 16 Q 20 13 16 12 Z" fill="#E8B574" />
                    <line x1="14" y1="14" x2="14" y2="18" stroke="#D4A05E" strokeWidth="0.5" />
                    <line x1="16" y1="13" x2="16" y2="19" stroke="#D4A05E" strokeWidth="0.5" />
                    <line x1="18" y1="14" x2="18" y2="18" stroke="#D4A05E" strokeWidth="0.5" />
                </svg>
            ),
            gradient: "from-yellow-600 to-orange-600"
        },
    ];

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
            {/* Header with Address and Cart */}
            <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between mb-3">
                        {/* Address with Geolocation */}
                        <div className="flex items-center gap-2 flex-1">
                            <MapPin className="h-5 w-5 text-primary-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">Entregar em</p>
                                <p className="font-semibold text-sm truncate">
                                    {userAddress || "Rua Exemplo, 123"}
                                </p>
                                {locationError && (
                                    <p className="text-[10px] text-red-500 truncate">{locationError}</p>
                                )}
                            </div>
                            <button
                                onClick={requestLocation}
                                disabled={locationLoading}
                                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 flex-shrink-0"
                                aria-label="Obter localização atual"
                                title="Obter localização atual"
                            >
                                {locationLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
                                ) : (
                                    <MapPinned className="h-4 w-4 text-primary-600" />
                                )}
                            </button>
                        </div>

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
                                    className={`aspect-square flex items-center justify-center p-4 rounded-2xl transition-all duration-300 ${isActive
                                        ? "bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 scale-105"
                                        : `${category.bgColor} hover:scale-105 hover:shadow-md`
                                        }`}
                                >
                                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                                        {category.icon}
                                    </div>
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

                {/* Choice Chips - Category Filters */}
                <section>
                    <h3 className="text-lg font-semibold font-heading mb-4">Explore por categoria</h3>
                    <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        {chipCategories.map((chip) => {
                            const isSelected = selectedChip === chip.id;
                            return (
                                <button
                                    key={chip.id}
                                    onClick={() => {
                                        if (chip.id === 'promos') {
                                            router.push('/promos');
                                        } else if (chip.id === 'lanches') {
                                            router.push('/lanches');
                                        } else {
                                            setSelectedChip(chip.id);
                                        }
                                    }}
                                    className={`
                                        flex items-center gap-2.5 px-5 py-3.5 rounded-full
                                        font-medium text-sm whitespace-nowrap
                                        transition-all duration-300 ease-out
                                        shadow-lg hover:shadow-xl
                                        ${isSelected
                                            ? `bg-gradient-to-r ${chip.gradient} text-white scale-105 shadow-2xl`
                                            : 'bg-white dark:bg-neutral-900 text-neutral-700  dark:text-neutral-300 border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 hover:scale-105'
                                        }
                                    `}
                                >
                                    <span className="flex items-center justify-center">{chip.icon}</span>
                                    <span className="font-semibold">{chip.label}</span>
                                </button>
                            );
                        })}
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
