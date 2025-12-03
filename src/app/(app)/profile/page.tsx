"use client";

import { useState, useEffect } from "react";
import { User, MapPin, ShoppingBag, Settings, Heart, LogOut, Loader2, ChevronRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { profileService, UserProfile } from "@/services/profile";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const menuItems = [
    {
        icon: User,
        label: "Dados pessoais",
        href: "/profile/personal-data",
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
        href: "/profile/orders",
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
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileService.getUserProfile();
            setProfile(data);
        } catch (error) {
            console.error("Error loading profile:", error);
            toast.error("Erro ao carregar perfil");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            // TODO: Implement proper logout with Supabase
            toast.success("Logout em breve!");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Erro ao sair");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    const displayName = profile?.name || "Usuário";
    const displayPhone = profile?.phone || "Não informado";
    const avatarLetter = displayName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen pb-20 bg-neutral-50 dark:bg-neutral-950">
            <Header title="Perfil" />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* User Info Card */}
                <Card variant="elevated" padding="lg">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {profile?.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt={displayName}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                avatarLetter
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold font-heading truncate">{displayName}</h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                                {displayPhone}
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
                                    onClick={() => router.push(item.href)}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                                        <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {item.description}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-neutral-400" />
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
                    <p>MeuDelivery v1.0.0</p>
                </div>
            </div>
        </div>
    );
}
