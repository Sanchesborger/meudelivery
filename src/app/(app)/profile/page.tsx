"use client";

import { User, MapPin, ShoppingBag, Settings, Heart, LogOut } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";

const menuItems = [
    {
        icon: User,
        label: "Dados pessoais",
        href: "/profile/personal",
        description: "Nome, telefone, e-mail",
    },
    {
        icon: MapPin,
        label: "Endereços",
        href: "/profile/addresses",
        description: "Gerenciar endereços de entrega",
    },
    {
        icon: ShoppingBag,
        label: "Histórico de pedidos",
        href: "/orders",
        description: "Ver pedidos anteriores",
    },
    {
        icon: Heart,
        label: "Favoritos",
        href: "/profile/favorites",
        description: "Restaurantes favoritos",
    },
    {
        icon: Settings,
        label: "Configurações",
        href: "/profile/settings",
        description: "Tema, notificações",
    },
];

export default function ProfilePage() {
    const handleLogout = () => {
        // TODO: Implement logout
        console.log("Logging out...");
    };

    return (
        <div className="min-h-screen pb-20">
            <Header title="Perfil" />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* User Info Card */}
                <Card variant="elevated" padding="lg">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                            U
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold font-heading">Usuário</h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                (11) 98765-4321
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Menu Items */}
                <Card variant="outlined" padding="none">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.href}>
                                <button
                                    onClick={() => (window.location.href = item.href)}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                        <Icon className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {item.description}
                                        </p>
                                    </div>
                                    <svg
                                        className="h-5 w-5 text-neutral-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                                {index < menuItems.length - 1 && <Divider />}
                            </div>
                        );
                    })}
                </Card>

                {/* Logout Button */}
                <Button
                    variant="outline"
                    fullWidth
                    onClick={handleLogout}
                    className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sair da conta
                </Button>

                {/* App Info */}
                <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                    <p>DeliveryX v1.0.0</p>
                </div>
            </div>
        </div>
    );
}
