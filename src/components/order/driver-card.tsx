"use client";

import { MessageCircle, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface DriverCardProps {
    driver: {
        id: string;
        name: string;
        photo?: string;
        rating: number;
        vehicle: string;
        plate: string;
    };
}

export function DriverCard({ driver }: DriverCardProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-4 mb-4">
                {/* Driver Photo */}
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
                    {driver.photo ? (
                        <Image
                            src={driver.photo}
                            alt={driver.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-600 text-white text-2xl font-bold">
                            {driver.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Driver Info */}
                <div className="flex-1">
                    <h3 className="font-semibold font-heading text-lg">
                        {driver.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-secondary-500 fill-secondary-500" />
                        <span className="font-medium">{driver.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {driver.vehicle} • {driver.plate}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    size="md"
                    onClick={() => alert("Chat em desenvolvimento")}
                    className="flex items-center justify-center gap-2"
                >
                    <MessageCircle className="h-4 w-4" />
                    Chat
                </Button>
                <Button
                    variant="outline"
                    size="md"
                    onClick={() => alert("Ligar para entregador")}
                    className="flex items-center justify-center gap-2"
                >
                    <Phone className="h-4 w-4" />
                    Ligar
                </Button>
            </div>
        </div>
    );
}
