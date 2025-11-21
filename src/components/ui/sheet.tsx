"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SheetProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    size?: "sm" | "md" | "lg" | "full";
}

export function Sheet({ open, onClose, children, title, size = "md" }: SheetProps) {
    // Prevent body scroll when sheet is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    const sizeClasses = {
        sm: "max-h-[40vh]",
        md: "max-h-[60vh]",
        lg: "max-h-[80vh]",
        full: "h-screen",
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl ${sizeClasses[size]}`}
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        </div>

                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between px-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                                <h2 className="text-lg font-semibold font-heading">
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: size === "full" ? "calc(100vh - 80px)" : "calc(80vh - 80px)" }}>
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
