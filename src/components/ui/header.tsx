"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: ReactNode;
    className?: string;
    transparent?: boolean;
    sticky?: boolean;
}

export function Header({
    title,
    showBack = false,
    onBack,
    rightAction,
    className,
    transparent = false,
    sticky = true,
}: HeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <header
            className={cn(
                "w-full border-b safe-top",
                sticky ? "sticky top-0 z-40" : "relative",
                transparent
                    ? "bg-transparent border-transparent"
                    : "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-neutral-200 dark:border-neutral-800",
                className
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            aria-label="Voltar"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}
                    {title && (
                        <h1 className="text-lg font-semibold font-heading truncate">{title}</h1>
                    )}
                </div>
                {rightAction && <div className="flex items-center gap-2">{rightAction}</div>}
            </div>
        </header>
    );
}
