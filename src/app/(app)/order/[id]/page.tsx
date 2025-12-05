"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    Package,
    MapPin,
    CreditCard,
    Clock,
    MessageCircle,
    Receipt,
    Star,
    Loader2,
} from "lucide-react";
import { Header } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { OrderTimeline, TimelineStep } from "@/components/order/order-timeline";
import { DeliveryMap } from "@/components/order/delivery-map";
import { DriverCard } from "@/components/order/driver-card";
import { ChatInterface } from "@/components/order/chat-interface";
import { RatingModal } from "@/components/order/rating-modal";
import { OrderReceipt } from "@/components/order/order-receipt";
import { formatCurrency } from "@/lib/utils";
import { ORDER_STATUS, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { orderService } from "@/services/orders";
import { toast } from "sonner";

export default function OrderTrackingPage() {
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
    const [showChat, setShowChat] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrder(orderId);
                setOrder(data);
            } catch (error) {
                console.error("Error fetching order:", error);
                toast.error("Erro ao carregar pedido");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    // Simulate real-time updates
    useEffect(() => {
        if (!order) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    // Simulate delivery completion
                    if (order.status === ORDER_STATUS.ON_THE_WAY) {
                        // In real app, this would come from websocket/polling
                        // setOrder(prev => ({ ...prev, status: ORDER_STATUS.DELIVERED }));
                        // setShowRating(true);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [order]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <Package className="h-16 w-16 text-neutral-300 mb-4" />
                <h2 className="text-xl font-bold mb-2">Pedido não encontrado</h2>
                <p className="text-neutral-600">Não foi possível encontrar os detalhes deste pedido.</p>
            </div>
        );
    }

    // Generate timeline steps
    const timelineSteps: TimelineStep[] = [
        {
            status: ORDER_STATUS.CONFIRMED,
            label: ORDER_STATUS_LABELS[ORDER_STATUS.CONFIRMED],
            timestamp: order.created_at,
            completed: true,
            active: order.status === ORDER_STATUS.CONFIRMED,
        },
        {
            status: ORDER_STATUS.PREPARING,
            label: ORDER_STATUS_LABELS[ORDER_STATUS.PREPARING],
            timestamp: undefined, // In real app, fetch from status history
            completed: [ORDER_STATUS.PREPARING, ORDER_STATUS.READY, ORDER_STATUS.ON_THE_WAY, ORDER_STATUS.DELIVERED].includes(order.status),
            active: order.status === ORDER_STATUS.PREPARING,
        },
        {
            status: ORDER_STATUS.READY,
            label: ORDER_STATUS_LABELS[ORDER_STATUS.READY],
            timestamp: undefined,
            completed: [ORDER_STATUS.READY, ORDER_STATUS.ON_THE_WAY, ORDER_STATUS.DELIVERED].includes(order.status),
            active: order.status === ORDER_STATUS.READY,
        },
        {
            status: ORDER_STATUS.ON_THE_WAY,
            label: ORDER_STATUS_LABELS[ORDER_STATUS.ON_THE_WAY],
            timestamp: undefined,
            completed: [ORDER_STATUS.ON_THE_WAY, ORDER_STATUS.DELIVERED].includes(order.status),
            active: order.status === ORDER_STATUS.ON_THE_WAY,
        },
        {
            status: ORDER_STATUS.DELIVERED,
            label: ORDER_STATUS_LABELS[ORDER_STATUS.DELIVERED],
            timestamp: order.status === ORDER_STATUS.DELIVERED ? order.updated_at : undefined,
            completed: order.status === ORDER_STATUS.DELIVERED,
            active: false,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case ORDER_STATUS.DELIVERED:
                return "success";
            case ORDER_STATUS.CANCELLED:
                return "error";
            case ORDER_STATUS.ON_THE_WAY:
            case ORDER_STATUS.PREPARING:
                return "warning";
            default:
                return "default";
        }
    };

    const handleRatingSubmit = (rating: any) => {
        console.log("Rating submitted:", rating);
        toast.success("Avaliação enviada com sucesso!");
        setShowRating(false);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="min-h-screen pb-20">
            <Header title="Acompanhar Pedido" showBack />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Status Header */}
                <Card variant="outlined" padding="lg">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold font-heading mb-2">
                                Pedido #{order.id.substring(0, 8)}
                            </h2>
                            <Badge
                                variant={getStatusColor(order.status) as any}
                                size="lg"
                            >
                                {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                            </Badge>
                        </div>
                        {order.status !== ORDER_STATUS.DELIVERED && (
                            <div className="text-right">
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                    Previsão de entrega
                                </p>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary-600" />
                                    <span className="text-2xl font-bold font-mono text-primary-600">
                                        {String(minutes).padStart(2, "0")}:
                                        {String(seconds).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Map */}
                {order.status === ORDER_STATUS.ON_THE_WAY && (
                    <DeliveryMap
                        restaurantLocation={{ lat: -23.550, lng: -46.633 }} // Mock location
                        driverLocation={{ lat: -23.552, lng: -46.636 }} // Mock location
                        userLocation={{ lat: order.address.latitude, lng: order.address.longitude }}
                    />
                )}

                {/* Driver Info - Mocked for now */}
                {order.status === ORDER_STATUS.ON_THE_WAY && (
                    <div className="relative">
                        <DriverCard driver={{
                            id: "driver-1",
                            name: "Carlos Silva",
                            rating: 4.8,
                            vehicle: "Moto Honda CG 160",
                            plate: "ABC-1234",
                        }} />
                        {/* Chat Button on Driver Card */}
                        <button
                            onClick={() => setShowChat(true)}
                            className="absolute top-4 right-4 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all"
                        >
                            <MessageCircle className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Action Buttons */}
                {order.status === ORDER_STATUS.DELIVERED && (
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={() => setShowReceipt(true)}>
                            <Receipt className="h-4 w-4 mr-2" />
                            Ver comprovante
                        </Button>
                        <Button onClick={() => setShowRating(true)}>
                            <Star className="h-4 w-4 mr-2" />
                            Avaliar pedido
                        </Button>
                    </div>
                )}

                {/* Timeline */}
                <Card variant="outlined" padding="lg">
                    <h3 className="font-semibold font-heading mb-4">Status do pedido</h3>
                    <OrderTimeline currentStatus={order.status} steps={timelineSteps} />
                </Card>

                {/* Order Details */}
                <Card variant="outlined" padding="lg">
                    <h3 className="font-semibold font-heading mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Itens do pedido
                    </h3>
                    <div className="space-y-3 mb-4">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-white opacity-80">
                                        {item.menu_item.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {item.quantity}x {item.menu_item.name}
                                    </p>
                                </div>
                                <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                                    {formatCurrency(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <Divider />

                    <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                                Subtotal
                            </span>
                            <span className="font-medium">
                                {formatCurrency(order.subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                                Taxa de entrega
                            </span>
                            <span className="font-medium">
                                {formatCurrency(order.delivery_fee)}
                            </span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-sm text-accent-600">
                                <span>Desconto</span>
                                <span className="font-medium">
                                    -{formatCurrency(order.discount)}
                                </span>
                            </div>
                        )}
                        <Divider />
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-primary-600">
                                {formatCurrency(order.total)}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Delivery Address */}
                <Card variant="outlined" padding="md">
                    <h3 className="font-semibold font-heading mb-3 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Endereço de entrega
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {order.address.street}, {order.address.number}
                        {order.address.complement &&
                            ` - ${order.address.complement}`}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {order.address.neighborhood} -{" "}
                        {order.address.city}, {order.address.state}
                    </p>
                </Card>

                {/* Payment Method */}
                <Card variant="outlined" padding="md">
                    <h3 className="font-semibold font-heading mb-3 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Forma de pagamento
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {PAYMENT_METHOD_LABELS[order.payment_method as keyof typeof PAYMENT_METHOD_LABELS] || order.payment_method}
                    </p>
                </Card>
            </div>

            {/* Chat Interface */}
            <ChatInterface
                open={showChat}
                onClose={() => setShowChat(false)}
                recipientName="Entregador"
                recipientAvatar="/drivers/driver-1.jpg"
            />

            {/* Rating Modal */}
            <RatingModal
                open={showRating}
                onClose={() => setShowRating(false)}
                onSubmit={handleRatingSubmit}
                restaurantName={order.restaurant.name}
            />

            {/* Order Receipt */}
            {showReceipt && (
                <OrderReceipt
                    open={showReceipt}
                    onClose={() => setShowReceipt(false)}
                    order={{
                        id: order.id,
                        createdAt: order.created_at,
                        restaurant: order.restaurant,
                        items: order.items.map((i: any) => ({
                            id: i.id,
                            name: i.menu_item.name,
                            quantity: i.quantity,
                            price: i.unit_price,
                        })),
                        deliveryAddress: order.address,
                        paymentMethod: order.payment_method,
                        subtotal: order.subtotal,
                        deliveryFee: order.delivery_fee,
                        discount: order.discount,
                        total: order.total,
                    }}
                />
            )}
        </div>
    );
}
