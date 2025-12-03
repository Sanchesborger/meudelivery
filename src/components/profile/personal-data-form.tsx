"use client";

import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/services/profile";
import Image from "next/image";

interface PersonalDataFormProps {
    initialData?: UserProfile;
    onSubmit: (data: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>) => Promise<void>;
    onUploadAvatar?: (file: File) => Promise<void>;
}

export function PersonalDataForm({ initialData, onSubmit, onUploadAvatar }: PersonalDataFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        phone: initialData?.phone || "",
        email: initialData?.email || "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const formatPhone = (value: string) => {
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length <= 11) {
            // Format: (00) 00000-0000
            if (cleaned.length <= 2) return cleaned;
            if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
            if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        }
        return value;
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhone(value);
        setFormData({ ...formData, phone: formatted });
        setErrors({ ...errors, phone: "" });
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = "Nome deve ter pelo menos 3 caracteres";
        }

        const phoneCleaned = formData.phone.replace(/\D/g, "");
        if (!formData.phone || phoneCleaned.length < 10) {
            newErrors.phone = "Telefone inválido";
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                await onSubmit(formData);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onUploadAvatar) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Por favor, selecione uma imagem");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("Imagem muito grande. Máximo 2MB");
            return;
        }

        setIsUploadingAvatar(true);
        try {
            await onUploadAvatar(file);
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Erro ao fazer upload da imagem");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            {onUploadAvatar && (
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-3xl font-bold">
                            {initialData?.avatar_url ? (
                                <Image
                                    src={initialData.avatar_url}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                formData.name?.charAt(0).toUpperCase() || "U"
                            )}
                        </div>
                        <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 p-2 bg-white dark:bg-neutral-900 rounded-full border-2 border-neutral-200 dark:border-neutral-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            {isUploadingAvatar ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
                            ) : (
                                <Camera className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                            )}
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                            disabled={isUploadingAvatar || isSubmitting}
                        />
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Clique na câmera para alterar foto
                    </p>
                </div>
            )}

            {/* Name */}
            <Input
                label="Nome completo"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: "" });
                }}
                error={errors.name}
                fullWidth
                disabled={isSubmitting}
                required
            />

            {/* Phone */}
            <Input
                label="Telefone"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                error={errors.phone}
                fullWidth
                disabled={isSubmitting}
                required
            />

            {/* Email */}
            <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                }}
                error={errors.email}
                fullWidth
                disabled={isSubmitting}
                required
            />

            {/* Submit Button */}
            <Button type="submit" fullWidth disabled={isSubmitting} size="lg">
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
        </form>
    );
}
