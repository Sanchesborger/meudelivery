"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "error" | "info";
    size?: "sm" | "md" | "lg";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "default", size = "md", children, ...props }, ref) => {
        const variants = {
            default: "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
            success: "bg-accent-100 text-accent-900 dark:bg-accent-900 dark:text-accent-100",
            warning: "bg-secondary-100 text-secondary-900 dark:bg-secondary-900 dark:text-secondary-100",
            error: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
            info: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
        };

        const sizes = {
            sm: "text-xs px-2 py-0.5",
            md: "text-sm px-2.5 py-1",
            lg: "text-base px-3 py-1.5",
        };

        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-full font-medium",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
