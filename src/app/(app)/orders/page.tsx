"use client";

import { useState } from "react";
import { Clock, MapPin, Package } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

// Mock orders
const mockOrders = [
    {
        id: "1",
        restaurant: {
            name: "Pizza Delícia",
            logo: "/restaurants/pizza-logo.jpg",
        },
        status: "delivered",
        total: 67.89,
        items: 3,
        createdAt: "2024-01-15T18:30:00",
        deliveredAt: "2024-01-15T19:15:00",
    },
    {
        id: "2",
        restaurant: {
            name: "Burger House",
            logo: "/restaurants/burger-logo.jpg",
        },
        status: "on_the_way",
        total: 45.50,
        items: 2,
        createdAt: "2024-01-16T12:00:00",
        estimatedDelivery: "12:45",
    },
];

export default function OrdersPage() {
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "delivered":
                return "success";
            case "cancelled":
                return "error";
            case "on_the_way":
            case "preparing":
                return "warning";
            default:
                return "default";
        }
    };

    return (
        <div className="min-h-screen pb-20">
            <Header title="Meus Pedidos" />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {[
                        { key: "all", label: "Todos" },
                        { key: "active", label: "Em andamento" },
                        { key: "completed", label: "Concluídos" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key as any)}
                            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${filter === tab.key
                                    ? "bg-primary-600 text-white"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {mockOrders.map((order) => (
                        <Card
                            key={order.id}
                            variant="outlined"
                            padding="md"
                            hoverable
                            onClick={() => (window.location.href = `/order/${order.id}`)}
                        >
                            <div className="space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold font-heading">
                                            {order.restaurant.name}
                                        </h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {order.items} {order.items === 1 ? "item" : "itens"}
                                        </p>
                                    </div>
                                    <Badge variant={getStatusVariant(order.status)} size="sm">
                                        {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                                    </Badge>
                                </div>

                                {/* Details */}
                                <div className="flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Package className="h-4 w-4" />
                                        <span className="font-medium text-primary-600">
                                            {formatCurrency(order.total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                {order.status === "on_the_way" && (
                                    <Button size="sm" fullWidth variant="outline">
                                        Acompanhar entrega
                                    </Button>
                                )}
                                {order.status === "delivered" && (
                                    <Button size="sm" fullWidth variant="ghost">
                                        Pedir novamente
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {mockOrders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold font-heading mb-2">
                            Nenhum pedido encontrado
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Faça seu primeiro pedido agora!
                        </p>
                        <Button onClick={() => (window.location.href = "/")}>
                            Ver restaurantes
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
