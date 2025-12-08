"use client";

import { useState } from "react";
import { Sun, Moon, Monitor, Bell, BellOff, Trash2, Loader2, ChevronRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { profileService } from "@/services/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const themeOptions = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
];

export default function SettingsPage() {
    const router = useRouter();
    const [theme, setTheme] = useState("system");
    const [notifications, setNotifications] = useState({
        orders: true,
        promotions: true,
        newRestaurants: false,
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        // TODO: Apply theme to document
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else if (newTheme === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            // System - check user preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
        toast.success("Tema atualizado");
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText.toLowerCase() !== "deletar") {
            toast.error('Digite "deletar" para confirmar');
            return;
        }

        setIsDeleting(true);
        try {
            await profileService.deleteAccount();
            toast.success("Conta excluída com sucesso");
            router.push("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Erro ao excluir conta");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen pb-20 bg-neutral-50 dark:bg-neutral-950">
            <Header title="Configurações" showBack />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Appearance */}
                <div>
                    <h3 className="text-lg font-semibold font-heading mb-3">Aparência</h3>
                    <Card padding="none">
                        {themeOptions.map((option, index) => {
                            const Icon = option.icon;
                            const isSelected = theme === option.value;
                            return (
                                <div key={option.value}>
                                    <button
                                        onClick={() => handleThemeChange(option.value)}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg ${isSelected ? "bg-primary-50 dark:bg-primary-900/20" : "bg-neutral-100 dark:bg-neutral-800"}`}>
                                            <Icon className={`h-5 w-5 ${isSelected ? "text-primary-600 dark:text-primary-400" : "text-neutral-600 dark:text-neutral-400"}`} />
                                        </div>
                                        <span className={`flex-1 text-left font-medium ${isSelected ? "text-primary-600 dark:text-primary-400" : ""}`}>
                                            {option.label}
                                        </span>
                                        {isSelected && (
                                            <div className="h-2 w-2 rounded-full bg-primary-600" />
                                        )}
                                    </button>
                                    {index < themeOptions.length - 1 && <Divider />}
                                </div>
                            );
                        })}
                    </Card>
                </div>

                {/* Notifications */}
                <div>
                    <h3 className="text-lg font-semibold font-heading mb-3">Notificações</h3>
                    <Card padding="none">
                        <div>
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                        <Bell className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Atualizações de pedidos</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Receba notificações sobre seus pedidos
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotifications({ ...notifications, orders: !notifications.orders })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.orders ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-700"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.orders ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                            <Divider />
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                        <Bell className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Promoções e ofertas</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Receba ofertas especiais
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotifications({ ...notifications, promotions: !notifications.promotions })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.promotions ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-700"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.promotions ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                            <Divider />
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                        <Bell className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Novos restaurantes</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Novidades na plataforma
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotifications({ ...notifications, newRestaurants: !notifications.newRestaurants })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.newRestaurants ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-700"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.newRestaurants ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Privacy */}
                <div>
                    <h3 className="text-lg font-semibold font-heading mb-3">Privacidade</h3>
                    <Card padding="none">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                            <span className="font-medium">Política de Privacidade</span>
                            <ChevronRight className="h-5 w-5 text-neutral-400" />
                        </button>
                        <Divider />
                        <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                            <span className="font-medium">Termos de Uso</span>
                            <ChevronRight className="h-5 w-5 text-neutral-400" />
                        </button>
                    </Card>
                </div>

                {/* Danger Zone */}
                <div>
                    <h3 className="text-lg font-semibold font-heading mb-3 text-red-600 dark:text-red-400">Zona de Perigo</h3>
                    <Card padding="lg" className="border-red-200 dark:border-red-900">
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium mb-1">Excluir conta</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setShowDeleteConfirm(true)}
                                className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                                <Trash2 className="h-5 w-5 mr-2" />
                                Excluir minha conta
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                open={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                }}
                title="Excluir conta permanentemente?"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            ⚠️ Esta ação não pode ser desfeita. Todos os seus dados, pedidos e favoritos serão excluídos permanentemente.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Digite <strong>"deletar"</strong> para confirmar:
                        </label>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:border-red-500 focus:outline-none transition-colors"
                            placeholder="deletar"
                            disabled={isDeleting}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteConfirmText("");
                            }}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || deleteConfirmText.toLowerCase() !== "deletar"}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                "Excluir conta"
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
