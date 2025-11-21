"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = "text",
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
                {label && (
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={type}
                        className={cn(
                            "flex h-11 w-full rounded-xl border-2 bg-white dark:bg-neutral-900 px-4 py-2 text-base transition-colors",
                            "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
                            "focus:outline-none focus:ring-2 focus:ring-offset-0",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            className
                        )}
                        disabled={disabled}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                {helperText && !error && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
