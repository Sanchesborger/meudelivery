"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("skeleton rounded-md bg-neutral-200 dark:bg-neutral-800", className)}
            {...props}
        />
    );
}

// Preset skeleton components
function SkeletonCard() {
    return (
        <div className="rounded-xl border-2 border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    );
}

function SkeletonRestaurantCard() {
    return (
        <div className="rounded-xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-800">
            <Skeleton className="h-32 w-full" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2 mt-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </div>
        </div>
    );
}

function SkeletonProductCard() {
    return (
        <div className="flex gap-3 p-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-800">
            <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-5 w-20 mt-2" />
            </div>
        </div>
    );
}

function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
            ))}
        </div>
    );
}

export { Skeleton, SkeletonCard, SkeletonRestaurantCard, SkeletonProductCard, SkeletonList };
