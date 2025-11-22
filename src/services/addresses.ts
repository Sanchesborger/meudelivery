import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Address } from "@/types";

const supabase = createClientComponentClient();

export const addressService = {
    async getAddresses() {
        const { data, error } = await supabase
            .from("addresses")
            .select("*")
            .order("is_default", { ascending: false })
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Address[];
    },

    async createAddress(address: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">) {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        // If this is the first address or set as default, update others
        if (address.is_default) {
            await this.clearDefaultAddress(user.id);
        } else {
            // Check if user has any address, if not, make this one default
            const { count } = await supabase
                .from("addresses")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id);

            if (count === 0) {
                address.is_default = true;
            }
        }

        const { data, error } = await supabase
            .from("addresses")
            .insert({
                ...address,
                user_id: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        return data as Address;
    },

    async updateAddress(id: string, updates: Partial<Address>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        if (updates.is_default) {
            await this.clearDefaultAddress(user.id);
        }

        const { data, error } = await supabase
            .from("addresses")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as Address;
    },

    async deleteAddress(id: string) {
        const { error } = await supabase
            .from("addresses")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    async clearDefaultAddress(userId: string) {
        const { error } = await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", userId)
            .eq("is_default", true);

        if (error) throw error;
    },
};
