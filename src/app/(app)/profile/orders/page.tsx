"use client";

import { useState, useEffect } from "react";
import { Package, Loader2, ChevronRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

// Placeholder - will be replaced with real data
const mockOrders = [
    {
        id: "1",
        restaurant_name: "Pizza Delícia",
        status: "delivered",
        total: 45.90,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        items_count: 3,
    },
    {
        id: "2",
        restaurant_name: "Burger House",
        status: "in_transit",
        total: 32.50,
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        items_count: 2,
    },
];

const statusConfig = {
    pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" },
    confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
    preparing: { label: "Preparando", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" },
    in_transit: { label: "A caminho", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" },
    delivered: { label: "Entregue", color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
    canceled: { label: "Cancelado", color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
};

export default function OrdersPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState(mockOrders);

    useEffect(() => {
        // TODO: Load real orders from Supabase
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Hoje";
        if (diffDays === 1) return "Ontem";
        if (diffDays < 7) return `Há ${diffDays} dias`;
        return date.toLocaleDateString("pt-BR");
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
            <Header title="Meus Pedidos" showBack />

            <div className="container mx-auto px-4 py-6">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex p-6 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
                            <Package className="h-12 w-12 text-neutral-400 dark:text-neutral-600" />
                        </div>
                        <h3 className="text-xl font-semibold font-heading mb-2">
                            Nenhum pedido ainda
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Quando você fizer seu primeiro pedido, ele aparecerá aqui
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const status = statusConfig[order.status as keyof typeof statusConfig];
                            return (
                                <Card
                                    key={order.id}
                                    padding="none"
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => router.push(`/order/${order.id}`)}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold font-heading mb-1">
                                                    {order.restaurant_name}
                                                </h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {order.items_count} {order.items_count === 1 ? "item" : "itens"}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-1" />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Badge className={status.color}>
                                                    {status.label}
                                                </Badge>
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {formatDate(order.created_at)}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-lg">
                                                {formatCurrency(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
