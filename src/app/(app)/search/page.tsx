"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/ui/header";

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
                    <div className="text-center py-12">
                        <Search className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
                        <h3 className="text-lg font-semibold font-heading mb-2">
                            O que você procura?
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Digite acima para buscar restaurantes ou pratos
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
