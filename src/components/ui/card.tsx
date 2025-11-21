"use client";

import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "outlined" | "glass";
    padding?: "none" | "sm" | "md" | "lg";
    hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = "default",
            padding = "md",
            hoverable = false,
            children,
            ...props
        },
        ref
    ) => {
        const variants = {
            default: "bg-white dark:bg-neutral-900",
            elevated: "bg-white dark:bg-neutral-900 shadow-lg",
            outlined:
                "bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800",
            glass: "glass glass-border",
        };

        const paddings = {
            none: "",
            sm: "p-3",
            md: "p-4",
            lg: "p-6",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl transition-all duration-200",
                    variants[variant],
                    paddings[padding],
                    hoverable && "hover:shadow-xl hover:-translate-y-0.5 cursor-pointer",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

const CardHeader = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
    HTMLHeadingElement,
    HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-xl font-semibold leading-none tracking-tight font-heading",
            className
        )}
        {...props}
    >
        {children}
    </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-neutral-600 dark:text-neutral-400", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center pt-4", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
