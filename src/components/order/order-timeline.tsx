"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { ORDER_STATUS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { motion } from "framer-motion";

export interface TimelineStep {
    status: string;
    label: string;
    timestamp?: string;
    completed: boolean;
    active: boolean;
}

interface OrderTimelineProps {
    currentStatus: string;
    steps: TimelineStep[];
}

export function OrderTimeline({ currentStatus, steps }: OrderTimelineProps) {
    return (
        <div className="relative">
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;

                return (
                    <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                        {/* Connector Line */}
                        {!isLast && (
                            <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700">
                                {step.completed && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "100%" }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full bg-primary-600"
                                    />
                                )}
                            </div>
                        )}

                        {/* Status Icon */}
                        <div className="relative z-10 flex-shrink-0">
                            {step.completed ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                </motion.div>
                            ) : step.active ? (
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center"
                                >
                                    <Clock className="h-5 w-5 text-white animate-pulse" />
                                </motion.div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                    <Circle className="h-5 w-5 text-neutral-400 dark:text-neutral-600" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-0.5">
                            <p className={`font-semibold ${step.completed || step.active ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-500"
                                }`}>
                                {step.label}
                            </p>
                            {step.timestamp && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                    {new Date(step.timestamp).toLocaleTimeString("pt-BR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
