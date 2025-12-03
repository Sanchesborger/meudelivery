"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/ui/header";
import { PersonalDataForm } from "@/components/profile/personal-data-form";
import { profileService, UserProfile } from "@/services/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PersonalDataPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileService.getUserProfile();
            setProfile(data);
        } catch (error) {
            console.error("Error loading profile:", error);
            toast.error("Erro ao carregar perfil");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>) => {
        try {
            const updated = await profileService.updateUserProfile(data);
            setProfile(updated);
            toast.success("Dados atualizados com sucesso");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Erro ao atualizar dados");
            throw error;
        }
    };

    const handleUploadAvatar = async (file: File) => {
        try {
            const avatarUrl = await profileService.uploadAvatar(file);
            setProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : null);
            toast.success("Foto atualizada com sucesso");
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error("Erro ao fazer upload da foto");
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        Erro ao carregar perfil
                    </p>
                    <button
                        onClick={() => router.push("/profile")}
                        className="text-primary-600 hover:underline"
                    >
                        Voltar ao perfil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            <Header title="Dados Pessoais" showBack />

            <div className="container mx-auto px-4 py-6">
                <PersonalDataForm
                    initialData={profile}
                    onSubmit={handleSubmit}
                    onUploadAvatar={handleUploadAvatar}
                />
            </div>
        </div>
    );
}
