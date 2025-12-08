"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    isLoading?: boolean;
}

export function OTPInput({
    length = 6,
    onComplete,
    isLoading = false,
}: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (isLoading) return;

        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if complete
        if (newOtp.every((digit) => digit !== "")) {
            onComplete(newOtp.join(""));
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (isLoading) return;

        if (e.key === "Backspace") {
            e.preventDefault();
            const newOtp = [...otp];

            if (otp[index]) {
                // Clear current input
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                // Move to previous input and clear it
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, length);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((char, index) => {
            if (index < length) {
                newOtp[index] = char;
            }
        });

        setOtp(newOtp);

        // Focus last filled input
        const lastFilledIndex = Math.min(pastedData.length, length) - 1;
        inputRefs.current[lastFilledIndex]?.focus();

        // Check if complete
        if (newOtp.every((digit) => digit !== "")) {
            onComplete(newOtp.join(""));
        }
    };

    return (
        <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isLoading}
                    className={cn(
                        "w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                        digit
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "border-neutral-300 dark:border-neutral-700",
                        isLoading && "opacity-50 cursor-not-allowed"
                    )}
                />
            ))}
        </div>
    );
}
