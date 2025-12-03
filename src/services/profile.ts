import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export interface UserProfile {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export const profileService = {
    async getUserProfile(): Promise<UserProfile | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return null;

            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) throw error;

            return data as UserProfile;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    },

    async updateUserProfile(updates: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>): Promise<UserProfile> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from("users")
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq("id", user.id)
            .select()
            .single();

        if (error) throw error;

        return data as UserProfile;
    },

    async uploadAvatar(file: File): Promise<string> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        // Update user profile with new avatar URL
        await this.updateUserProfile({ avatar_url: publicUrl });

        return publicUrl;
    },

    async deleteAccount(): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        // Soft delete: mark user as deleted
        const { error } = await supabase
            .from("users")
            .update({
                deleted_at: new Date().toISOString(),
                email: `deleted_${user.id}@deleted.com`, // Anonymize
                phone: null,
                name: "Deleted User",
            })
            .eq("id", user.id);

        if (error) throw error;

        // Sign out
        await supabase.auth.signOut();
    },
};
