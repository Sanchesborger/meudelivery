"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/ui/header";

const categories = [
    {
        id: "pizza",
        name: "Pizza",
        count: 45,
        gradient: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={56} height={56}>
                <defs>
                    <linearGradient id="search-pizza-crust" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E8A865" />
                        <stop offset="100%" stopColor="#C17D48" />
                    </linearGradient>
                    <linearGradient id="search-pizza-cheese" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE55C" />
                        <stop offset="100%" stopColor="#FFC107" />
                    </linearGradient>
                </defs>
                <path d="M 40 12 L 12 68 L 68 68 Z" fill="url(#search-pizza-crust)" />
                <path d="M 40 18 L 16 64 L 64 64 Z" fill="url(#search-pizza-cheese)" />
                <circle cx="34" cy="36" r="5" fill="#E63946" />
                <circle cx="46" cy="42" r="5" fill="#E63946" />
                <circle cx="40" cy="52" r="5" fill="#E63946" />
            </svg>
        ),
    },
    {
        id: "burger",
        name: "Hambúrguer",
        count: 38,
        gradient: "linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={56} height={56}>
                <defs>
                    <linearGradient id="search-burger-bun" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F5C98B" />
                        <stop offset="100%" stopColor="#D4A05E" />
                    </linearGradient>
                </defs>
                <ellipse cx="40" cy="28" rx="22" ry="10" fill="url(#search-burger-bun)" />
                <ellipse cx="40" cy="36" rx="23" ry="1.5" fill="#7CB342" />
                <ellipse cx="40" cy="39" rx="22" ry="1.5" fill="#E53935" />
                <path d="M 18 42 L 62 42 L 60 45 L 20 45 Z" fill="#FFD93D" />
                <ellipse cx="40" cy="50" rx="22" ry="3" fill="#8B5A3C" />
                <ellipse cx="40" cy="56" rx="22" ry="8" fill="#E8B574" />
            </svg>
        ),
    },
    {
        id: "japanese",
        name: "Japonesa",
        count: 28,
        gradient: "linear-gradient(135deg, #EF5350 0%, #E53935 100%)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={56} height={56}>
                <defs>
                    <radialGradient id="search-sushi-rice">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#F5F5F5" />
                    </radialGradient>
                </defs>
                <rect x="8" y="36" width="64" height="32" rx="4" fill="#A67C52" />
                <circle cx="24" cy="46" r="7" fill="url(#search-sushi-rice)" />
                <circle cx="24" cy="46" r="5.5" fill="#2C3E50" />
                <circle cx="24" cy="46" r="3" fill="#E74C3C" />
                <circle cx="40" cy="46" r="7" fill="url(#search-sushi-rice)" />
                <circle cx="40" cy="46" r="5.5" fill="#2C3E50" />
                <circle cx="40" cy="46" r="3" fill="#FF9A8B" />
                <circle cx="56" cy="46" r="7" fill="url(#search-sushi-rice)" />
                <circle cx="56" cy="46" r="5.5" fill="#2C3E50" />
                <circle cx="56" cy="46" r="3" fill="#52B788" />
            </svg>
        ),
    },
    {
        id: "dessert",
        name: "Sobremesas",
        count: 52,
        gradient: "linear-gradient(135deg, #EC407A 0%, #F06292 100%)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={56} height={56}>
                <defs>
                    <linearGradient id="search-cone" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E8B574" />
                        <stop offset="100%" stopColor="#C18A48" />
                    </linearGradient>
                </defs>
                <path d="M 32 44 L 24 72 L 56 72 L 48 44 Z" fill="url(#search-cone)" />
                <ellipse cx="40" cy="44" rx="15" ry="12" fill="#FFFACD" />
                <ellipse cx="40" cy="34" rx="14" ry="11" fill="#FFB3D9" />
                <ellipse cx="40" cy="24" rx="13" ry="10" fill="#FFFEF7" />
            </svg>
        ),
    },
    {
        id: "drinks",
        name: "Bebidas",
        count: 67,
        gradient: "linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={56} height={56}>
                <defs>
                    <linearGradient id="search-bottle" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#43A047" />
                        <stop offset="100%" stopColor="#2E7D32" />
                    </linearGradient>
                    <linearGradient id="search-can" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E53935" />
                        <stop offset="100%" stopColor="#C62828" />
                    </linearGradient>
                </defs>
                <rect x="20" y="32" width="14" height="38" rx="2" fill="url(#search-bottle)" />
                <rect x="23" y="26" width="8" height="6" rx="1" fill="url(#search-bottle)" />
                <rect x="46" y="38" width="16" height="32" rx="2" fill="url(#search-can)" />
                <ellipse cx="54" cy="38" rx="8" ry="3" fill="#E53935" />
            </svg>
        ),
    },
    {
        id: "healthy",
        name: "Saudável",
        count: 34,
        gradient: "linear-gradient(135deg, #66BB6A 0%, #43A047 100%)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={56} height={56}>
                <defs>
                    <linearGradient id="search-bowl" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F5DEB3" />
                        <stop offset="100%" stopColor="#D2B48C" />
                    </linearGradient>
                </defs>
                <ellipse cx="40" cy="58" rx="28" ry="8" fill="url(#search-bowl)" />
                <path d="M 12 58 Q 12 32 40 32 Q 68 32 68 58" fill="url(#search-bowl)" />
                <ellipse cx="28" cy="42" rx="8" ry="7" fill="#7CB342" />
                <ellipse cx="40" cy="40" rx="8" ry="7" fill="#9CCC65" />
                <ellipse cx="52" cy="42" rx="8" ry="7" fill="#7CB342" />
                <circle cx="26" cy="48" r="4" fill="#E53935" />
                <circle cx="54" cy="48" r="4" fill="#E53935" />
            </svg>
        ),
    },
    {
        id: "pasta",
        name: "Massas",
        count: 31,
        gradient: "linear-gradient(135deg, #FFCA28 0%, #FFA000 100%)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={56} height={56}>
                <defs>
                    <linearGradient id="search-pasta-plate" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F5F5F5" />
                        <stop offset="100%" stopColor="#E0E0E0" />
                    </linearGradient>
                </defs>
                <ellipse cx="40" cy="60" rx="30" ry="8" fill="url(#search-pasta-plate)" />
                <path d="M 10 60 Q 10 30 40 30 Q 70 30 70 60" fill="url(#search-pasta-plate)" />
                <path d="M 25 45 Q 30 40 35 45 Q 40 50 45 45 Q 50 40 55 45" stroke="#FFD93D" strokeWidth="4" fill="none" />
                <path d="M 28 50 Q 33 45 38 50 Q 43 55 48 50" stroke="#FFD93D" strokeWidth="4" fill="none" />
                <circle cx="35" cy="42" r="3" fill="#E53935" />
                <circle cx="45" cy="48" r="3" fill="#E53935" />
            </svg>
        ),
    },
    {
        id: "breakfast",
        name: "Café da Manhã",
        count: 42,
        gradient: "linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={56} height={56}>
                <defs>
                    <linearGradient id="search-bread" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F5C98B" />
                        <stop offset="100%" stopColor="#C99A5A" />
                    </linearGradient>
                </defs>
                <ellipse cx="40" cy="50" rx="20" ry="8" fill="#C99A5A" />
                <path d="M 20 50 Q 20 30 40 30 Q 60 30 60 50" fill="url(#search-bread)" />
                <line x1="28" y1="35" x2="28" y2="48" stroke="#D4A05E" strokeWidth="1.5" />
                <line x1="34" y1="33" x2="34" y2="49" stroke="#D4A05E" strokeWidth="1.5" />
                <line x1="40" y1="32" x2="40" y2="50" stroke="#D4A05E" strokeWidth="1.5" />
                <line x1="46" y1="33" x2="46" y2="49" stroke="#D4A05E" strokeWidth="1.5" />
                <line x1="52" y1="35" x2="52" y2="48" stroke="#D4A05E" strokeWidth="1.5" />
            </svg>
        ),
    },
];

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen pb-20">
            <Header title="Buscar" showBack={false} />

            <main className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <Input
                        placeholder="Buscar restaurantes, pratos ou categorias..."
                        leftIcon={<Search className="h-5 w-5" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        autoFocus
                    />
                </div>

                {searchQuery ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Buscando por: <span className="font-semibold">{searchQuery}</span>
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="text-center py-8">
                            <Search className="h-12 w-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-700" />
                            <h3 className="text-lg font-semibold font-heading mb-1">
                                O que você procura?
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Digite acima para buscar restaurantes ou pratos
                            </p>
                        </div>

                        {/* Categories Grid */}
                        <div className="mt-6">
                            <h4 className="text-base font-semibold font-heading mb-4">
                                Categorias populares
                            </h4>
                            <div className="grid grid-cols-2 gap-2.5">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSearchQuery(category.name)}
                                        className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all active:scale-95"
                                    >
                                        <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-md" style={{ background: category.gradient }}>
                                            <div className="scale-75">
                                                {category.icon}
                                            </div>
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 leading-tight truncate">
                                                {category.name}
                                            </p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                                {category.count} opções
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
