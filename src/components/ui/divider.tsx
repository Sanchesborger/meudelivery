"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
    text?: string;
}

export function Divider({
    className,
    orientation = "horizontal",
    text,
    ...props
}: DividerProps) {
    if (text) {
        return (
            <div className={cn("relative flex items-center py-4", className)} {...props}>
                <div className="flex-grow border-t border-neutral-300 dark:border-neutral-700" />
                <span className="mx-4 flex-shrink text-sm text-neutral-500 dark:text-neutral-400">
                    {text}
                </span>
                <div className="flex-grow border-t border-neutral-300 dark:border-neutral-700" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                orientation === "horizontal"
                    ? "h-px w-full bg-neutral-300 dark:bg-neutral-700"
                    : "w-px h-full bg-neutral-300 dark:bg-neutral-700",
                className
            )}
            {...props}
        />
    );
}
