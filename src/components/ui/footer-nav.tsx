"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    {
        label: "Início",
        href: "/",
        icon: Home,
    },
    {
        label: "Buscar",
        href: "/search",
        icon: Search,
    },
    {
        label: "Pedidos",
        href: "/orders",
        icon: ShoppingBag,
    },
    {
        label: "Perfil",
        href: "/profile",
        icon: User,
    },
];

export function FooterNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 safe-bottom">
            <div className="container mx-auto px-2">
                <div className="flex items-center justify-around h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[70px]",
                                    isActive
                                        ? "text-primary-600 dark:text-primary-400"
                                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "h-5 w-5 transition-transform",
                                        isActive && "scale-110"
                                    )}
                                />
                                <span className="text-xs font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
