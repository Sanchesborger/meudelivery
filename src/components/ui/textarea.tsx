"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextAreaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            className,
            label,
            error,
            helperText,
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
                <textarea
                    ref={ref}
                    className={cn(
                        "flex min-h-[100px] w-full rounded-xl border-2 bg-white dark:bg-neutral-900 px-4 py-3 text-base transition-colors resize-y",
                        "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
                        "focus:outline-none focus:ring-2 focus:ring-offset-0",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20",
                        className
                    )}
                    disabled={disabled}
                    {...props}
                />
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                {helperText && !error && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
                )}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";

export { TextArea };
