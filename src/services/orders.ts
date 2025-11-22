import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CartItem } from "@/hooks/use-cart";

const supabase = createClientComponentClient();

export interface CreateOrderParams {
    restaurantId: string;
    addressId: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentMethod: string;
    changeFor?: string;
    notes?: string;
}

export const orderService = {
    async createOrder(params: CreateOrderParams) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // 1. Create Order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: user.id,
                restaurant_id: params.restaurantId,
                address_id: params.addressId,
                status: "pending",
                subtotal: params.subtotal,
                delivery_fee: params.deliveryFee,
                discount: params.discount,
                total: params.total,
                payment_method: params.paymentMethod,
                change_for: params.changeFor,
                notes: params.notes,
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Create Order Items
        const orderItems = params.items.map((item) => ({
            order_id: order.id,
            menu_item_id: item.menuItem.id,
            quantity: item.quantity,
            unit_price: item.menuItem.price,
            subtotal: item.subtotal,
            notes: item.notes,
        }));

        const { data: createdItems, error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems)
            .select();

        if (itemsError) throw itemsError;

        // 3. Create Order Item Extras (if any)
        // Note: This assumes we have a way to link extras to items. 
        // For now, we'll skip this as the CartItem structure might need adjustment to support extras properly in the database.
        // In a real app, we would iterate over items and their extras.

        return order;
    },

    async getOrder(orderId: string) {
        const { data, error } = await supabase
            .from("orders")
            .select(`
        *,
        restaurant:restaurants(*),
        address:addresses(*),
        items:order_items(
          *,
          menu_item:menu_items(*)
        )
      `)
            .eq("id", orderId)
            .single();

        if (error) throw error;
        return data;
    },
};
