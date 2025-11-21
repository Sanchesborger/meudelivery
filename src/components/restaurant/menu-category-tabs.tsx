import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface MenuCategory {
    id: string;
    name: string;
    count: number;
}

interface MenuCategoryTabsProps {
    categories: MenuCategory[];
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

export function MenuCategoryTabs({
    categories,
    activeCategory,
    onCategoryChange,
}: MenuCategoryTabsProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftShadow, setShowLeftShadow] = useState(false);
    const [showRightShadow, setShowRightShadow] = useState(true);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftShadow(scrollLeft > 0);
        setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        handleScroll();
    }, []);

    return (
        <div className="relative bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            {/* Left Shadow */}
            {showLeftShadow && (
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent z-10 pointer-events-none" />
            )}

            {/* Scrollable Tabs */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-1 px-4 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {categories.map((category) => {
                    const isActive = category.id === activeCategory;
                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 whitespace-nowrap font-medium text-sm transition-all relative flex-shrink-0",
                                isActive
                                    ? "text-primary-600"
                                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                            )}
                        >
                            <span>{category.name}</span>
                            {category.count > 0 && (
                                <span
                                    className={cn(
                                        "px-1.5 py-0.5 rounded-full text-xs font-semibold",
                                        isActive
                                            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                                    )}
                                >
                                    {category.count}
                                </span>
                            )}
                            {/* Active Indicator */}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Right Shadow */}
            {showRightShadow && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent z-10 pointer-events-none" />
            )}
        </div>
    );
}
