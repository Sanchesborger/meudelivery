"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
    Package,
    MapPin,
    CreditCard,
    Clock,
    MessageCircle,
    Receipt,
    Star,
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
import { ORDER_STATUS, ORDER_STATUS_LABELS } from "@/lib/constants";

// Mock order data
const mockOrder = {
    id: "ABC123",
    status: ORDER_STATUS.ON_THE_WAY,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    restaurant: {
        name: "Pizza Delícia",
        logo: "/restaurants/pizza-logo.jpg",
        address: "Rua das Pizzas, 456",
        location: { lat: -23.550, lng: -46.633 },
    },
    items: [
        {
            id: "1",
            name: "Pizza Margherita Grande",
            quantity: 1,
            price: 45.90,
            image: "/menu/pizza-margherita.jpg",
        },
        {
            id: "2",
            name: "Coca-Cola 2L",
            quantity: 1,
            price: 12.00,
        },
    ],
    subtotal: 57.90,
    deliveryFee: 7.90,
    discount: 0,
    total: 65.80,
    paymentMethod: "pix",
    deliveryAddress: {
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 45",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        location: { lat: -23.555, lng: -46.640 },
    },
    driver: {
        id: "driver-1",
        name: "Carlos Silva",
        photo: "/drivers/driver-1.jpg",
        rating: 4.8,
        vehicle: "Moto Honda CG 160",
        plate: "ABC-1234",
        location: { lat: -23.552, lng: -46.636 },
    },
};

export default function OrderTrackingPage() {
    const params = useParams();
    const orderId = params.id as string;

    const [currentStatus, setCurrentStatus] = useState<string>(mockOrder.status);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
    const [showChat, setShowChat] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);

    // Simulate real-time updates
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    // Simulate delivery completion
                    if (currentStatus === ORDER_STATUS.ON_THE_WAY) {
                        setCurrentStatus(ORDER_STATUS.DELIVERED);
                        setShowRating(true);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentStatus]);

    // Generate timeline steps
    const timelineSteps: TimelineStep[] = [
        {
            status: ORDER_STATUS.CONFIRMED,
            label: ORDER_STATUS_LABELS[ORDER_STATUS.CONFIRMED],
            timestamp: mockOrder.createdAt,
            completed: true,
            active: false,
        },
        {
            status: ORDER_STATUS.PREPARING,
            label: ORDER_STATUS_LABELS[ORDER_STATUS.PREPARING],
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            completed: true,
            active: false,
        },
        {
            status: ORDER_STATUS.READY,
            label: ORDER_STATUS_LABELS[ORDER_STATUS.READY],
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            completed: true,
            active: false,
        },
        {
            status: ORDER_STATUS.ON_THE_WAY,
            label: ORDER_STATUS_LABELS[ORDER_STATUS.ON_THE_WAY],
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            completed: currentStatus === ORDER_STATUS.DELIVERED,
            active: currentStatus === ORDER_STATUS.ON_THE_WAY,
        },
        {
            status: ORDER_STATUS.DELIVERED,
            label: ORDER_STATUS_LABELS[ORDER_STATUS.DELIVERED],
            timestamp:
                currentStatus === ORDER_STATUS.DELIVERED
                    ? new Date().toISOString()
                    : undefined,
            completed: currentStatus === ORDER_STATUS.DELIVERED,
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
        // In real app, submit to API
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
                                Pedido #{orderId}
                            </h2>
                            <Badge
                                variant={getStatusColor(currentStatus) as any}
                                size="lg"
                            >
                                {
                                    ORDER_STATUS_LABELS[
                                    currentStatus as keyof typeof ORDER_STATUS_LABELS
                                    ]
                                }
                            </Badge>
                        </div>
                        {currentStatus !== ORDER_STATUS.DELIVERED && (
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
                {currentStatus === ORDER_STATUS.ON_THE_WAY && (
                    <DeliveryMap
                        restaurantLocation={mockOrder.restaurant.location}
                        driverLocation={mockOrder.driver?.location}
                        userLocation={mockOrder.deliveryAddress.location}
                    />
                )}

                {/* Driver Info */}
                {mockOrder.driver && currentStatus === ORDER_STATUS.ON_THE_WAY && (
                    <div className="relative">
                        <DriverCard driver={mockOrder.driver} />
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
                {currentStatus === ORDER_STATUS.DELIVERED && (
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
                    <OrderTimeline currentStatus={currentStatus} steps={timelineSteps} />
                </Card>

                {/* Order Details */}
                <Card variant="outlined" padding="lg">
                    <h3 className="font-semibold font-heading mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Itens do pedido
                    </h3>
                    <div className="space-y-3 mb-4">
                        {mockOrder.items.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                {item.image && (
                                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {item.quantity}x {item.name}
                                    </p>
                                </div>
                                <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                                    {formatCurrency(item.price * item.quantity)}
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
                                {formatCurrency(mockOrder.subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                                Taxa de entrega
                            </span>
                            <span className="font-medium">
                                {formatCurrency(mockOrder.deliveryFee)}
                            </span>
                        </div>
                        {mockOrder.discount > 0 && (
                            <div className="flex justify-between text-sm text-accent-600">
                                <span>Desconto</span>
                                <span className="font-medium">
                                    -{formatCurrency(mockOrder.discount)}
                                </span>
                            </div>
                        )}
                        <Divider />
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-primary-600">
                                {formatCurrency(mockOrder.total)}
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
                        {mockOrder.deliveryAddress.street}, {mockOrder.deliveryAddress.number}
                        {mockOrder.deliveryAddress.complement &&
                            ` - ${mockOrder.deliveryAddress.complement}`}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {mockOrder.deliveryAddress.neighborhood} -{" "}
                        {mockOrder.deliveryAddress.city}, {mockOrder.deliveryAddress.state}
                    </p>
                </Card>

                {/* Payment Method */}
                <Card variant="outlined" padding="md">
                    <h3 className="font-semibold font-heading mb-3 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Forma de pagamento
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 uppercase">
                        {mockOrder.paymentMethod}
                    </p>
                </Card>
            </div>

            {/* Chat Interface */}
            <ChatInterface
                open={showChat}
                onClose={() => setShowChat(false)}
                recipientName={mockOrder.driver?.name || "Entregador"}
                recipientAvatar={mockOrder.driver?.photo}
            />

            {/* Rating Modal */}
            <RatingModal
                open={showRating}
                onClose={() => setShowRating(false)}
                onSubmit={handleRatingSubmit}
                restaurantName={mockOrder.restaurant.name}
            />

            {/* Order Receipt */}
            <OrderReceipt
                open={showReceipt}
                onClose={() => setShowReceipt(false)}
                order={{
                    id: orderId,
                    createdAt: mockOrder.createdAt,
                    restaurant: mockOrder.restaurant,
                    items: mockOrder.items,
                    deliveryAddress: mockOrder.deliveryAddress,
                    paymentMethod: mockOrder.paymentMethod,
                    subtotal: mockOrder.subtotal,
                    deliveryFee: mockOrder.deliveryFee,
                    discount: mockOrder.discount,
                    total: mockOrder.total,
                }}
            />
        </div>
    );
}
