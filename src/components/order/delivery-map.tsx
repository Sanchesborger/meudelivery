"use client";

import { MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";

interface DeliveryMapProps {
    restaurantLocation: { lat: number; lng: number };
    driverLocation?: { lat: number; lng: number };
    userLocation: { lat: number; lng: number };
}

export function DeliveryMap({
    restaurantLocation,
    driverLocation,
    userLocation
}: DeliveryMapProps) {
    return (
        <div className="relative w-full h-[300px] bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900 rounded-2xl overflow-hidden">
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full">
                <motion.line
                    x1="20%"
                    y1="30%"
                    x2="80%"
                    y2="70%"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeDasharray="10,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
            </svg>

            {/* Restaurant Marker */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-[25%] left-[15%] flex flex-col items-center"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                    <div className="relative bg-red-600 p-3 rounded-full shadow-lg">
                        <MapPin className="h-6 w-6 text-white fill-white" />
                    </div>
                </div>
                <div className="mt-2 bg-white dark:bg-neutral-800 px-3 py-1 rounded-full shadow-md">
                    <p className="text-xs font-semibold">Restaurante</p>
                </div>
            </motion.div>

            {/* Driver Marker */}
            {driverLocation && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{
                        scale: 1,
                        y: [0, -10, 0]
                    }}
                    transition={{
                        scale: { delay: 0.4 },
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute top-[45%] left-[50%] flex flex-col items-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-75" />
                        <div className="relative bg-primary-600 p-3 rounded-full shadow-lg">
                            <Navigation className="h-6 w-6 text-white fill-white" />
                        </div>
                    </div>
                    <div className="mt-2 bg-white dark:bg-neutral-800 px-3 py-1 rounded-full shadow-md">
                        <p className="text-xs font-semibold">Entregador</p>
                    </div>
                </motion.div>
            )}

            {/* User Location Marker */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute top-[65%] right-[15%] flex flex-col items-center"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                    <div className="relative bg-green-600 p-3 rounded-full shadow-lg">
                        <MapPin className="h-6 w-6 text-white fill-white" />
                    </div>
                </div>
                <div className="mt-2 bg-white dark:bg-neutral-800 px-3 py-1 rounded-full shadow-md">
                    <p className="text-xs font-semibold">Você</p>
                </div>
            </motion.div>

            {/* Zoom Controls (Visual Only) */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="bg-white dark:bg-neutral-800 p-2 rounded-lg shadow-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <span className="text-xl font-bold">+</span>
                </button>
                <button className="bg-white dark:bg-neutral-800 p-2 rounded-lg shadow-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <span className="text-xl font-bold">−</span>
                </button>
            </div>
        </div>
    );
}
