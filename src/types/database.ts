export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string | null
                    phone: string
                    name: string
                    avatar_url: string | null
                    cpf: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email?: string | null
                    phone: string
                    name: string
                    avatar_url?: string | null
                    cpf?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    phone?: string
                    name?: string
                    avatar_url?: string | null
                    cpf?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            addresses: {
                Row: {
                    id: string
                    user_id: string
                    label: string
                    type: string
                    street: string
                    number: string
                    complement: string | null
                    neighborhood: string
                    city: string
                    state: string
                    zip_code: string
                    latitude: number
                    longitude: number
                    is_default: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    label: string
                    type: string
                    street: string
                    number: string
                    complement?: string | null
                    neighborhood: string
                    city: string
                    state: string
                    zip_code: string
                    latitude: number
                    longitude: number
                    is_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    label?: string
                    type?: string
                    street?: string
                    number?: string
                    complement?: string | null
                    neighborhood?: string
                    city?: string
                    state?: string
                    zip_code?: string
                    latitude?: number
                    longitude?: number
                    is_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            restaurants: {
                Row: {
                    id: string
                    name: string
                    description: string
                    category: string
                    cover_image: string
                    logo_image: string
                    rating: number
                    total_reviews: number
                    delivery_time: number
                    delivery_fee: number
                    min_order_value: number
                    latitude: number
                    longitude: number
                    address: string
                    phone: string
                    is_open: boolean
                    opening_hours: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description: string
                    category: string
                    cover_image: string
                    logo_image: string
                    rating?: number
                    total_reviews?: number
                    delivery_time: number
                    delivery_fee: number
                    min_order_value: number
                    latitude: number
                    longitude: number
                    address: string
                    phone: string
                    is_open?: boolean
                    opening_hours: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string
                    category?: string
                    cover_image?: string
                    logo_image?: string
                    rating?: number
                    total_reviews?: number
                    delivery_time?: number
                    delivery_fee?: number
                    min_order_value?: number
                    latitude?: number
                    longitude?: number
                    address?: string
                    phone?: string
                    is_open?: boolean
                    opening_hours?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            menu_categories: {
                Row: {
                    id: string
                    restaurant_id: string
                    name: string
                    description: string | null
                    display_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    restaurant_id: string
                    name: string
                    description?: string | null
                    display_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    restaurant_id?: string
                    name?: string
                    description?: string | null
                    display_order?: number
                    created_at?: string
                }
            }
            menu_items: {
                Row: {
                    id: string
                    restaurant_id: string
                    category_id: string
                    name: string
                    description: string
                    price: number
                    image_url: string | null
                    is_available: boolean
                    preparation_time: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    restaurant_id: string
                    category_id: string
                    name: string
                    description: string
                    price: number
                    image_url?: string | null
                    is_available?: boolean
                    preparation_time?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    restaurant_id?: string
                    category_id?: string
                    name?: string
                    description?: string
                    price?: number
                    image_url?: string | null
                    is_available?: boolean
                    preparation_time?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    restaurant_id: string
                    address_id: string
                    courier_id: string | null
                    status: string
                    subtotal: number
                    delivery_fee: number
                    discount: number
                    total: number
                    payment_method: string
                    payment_status: string
                    delivery_type: string
                    estimated_delivery_time: string | null
                    delivered_at: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    restaurant_id: string
                    address_id: string
                    courier_id?: string | null
                    status?: string
                    subtotal: number
                    delivery_fee: number
                    discount?: number
                    total: number
                    payment_method: string
                    payment_status?: string
                    delivery_type?: string
                    estimated_delivery_time?: string | null
                    delivered_at?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    restaurant_id?: string
                    address_id?: string
                    courier_id?: string | null
                    status?: string
                    subtotal?: number
                    delivery_fee?: number
                    discount?: number
                    total?: number
                    payment_method?: string
                    payment_status?: string
                    delivery_type?: string
                    estimated_delivery_time?: string | null
                    delivered_at?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    menu_item_id: string
                    quantity: number
                    unit_price: number
                    subtotal: number
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    menu_item_id: string
                    quantity: number
                    unit_price: number
                    subtotal: number
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    menu_item_id?: string
                    quantity?: number
                    unit_price?: number
                    subtotal?: number
                    notes?: string | null
                    created_at?: string
                }
            }
            couriers: {
                Row: {
                    id: string
                    name: string
                    phone: string
                    vehicle_type: string
                    vehicle_plate: string
                    latitude: number | null
                    longitude: number | null
                    is_available: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    phone: string
                    vehicle_type: string
                    vehicle_plate: string
                    latitude?: number | null
                    longitude?: number | null
                    is_available?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    phone?: string
                    vehicle_type?: string
                    vehicle_plate?: string
                    latitude?: number | null
                    longitude?: number | null
                    is_available?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            favorites: {
                Row: {
                    id: string
                    user_id: string
                    restaurant_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    restaurant_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    restaurant_id?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
