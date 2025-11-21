import { Database } from "./database";

// Database Table Types
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type MenuCategory = Database["public"]["Tables"]["menu_categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Courier = Database["public"]["Tables"]["couriers"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];

// Extended Types
export interface RestaurantWithDistance extends Restaurant {
    distance?: number;
    isFavorite?: boolean;
}

export interface MenuItemWithExtras extends MenuItem {
    extras?: Extra[];
}

export interface Extra {
    id: string;
    name: string;
    price: number;
    maxQuantity?: number;
}

export interface CartItem {
    id: string;
    menuItem: MenuItem;
    quantity: number;
    notes?: string;
    extras?: {
        id: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    subtotal: number;
}

export interface Cart {
    items: CartItem[];
    restaurant: Restaurant | null;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
}

export interface OrderWithDetails extends Order {
    restaurant: Restaurant;
    address: Address;
    courier: Courier | null;
    items: (OrderItem & { menu_item: MenuItem })[];
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface MapMarker {
    id: string;
    position: Location;
    type: "restaurant" | "user" | "courier";
    data?: any;
}

export interface SearchResult {
    type: "restaurant" | "menu_item";
    id: string;
    name: string;
    description?: string;
    image?: string;
    restaurantId?: string;
    restaurantName?: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    createdAt: string;
    data?: any;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: string;
    read: boolean;
}

export interface OrderTracking {
    orderId: string;
    status: string;
    timeline: TimelineEvent[];
    courierLocation?: Location;
    estimatedDeliveryTime?: string;
}

export interface TimelineEvent {
    status: string;
    label: string;
    timestamp?: string;
    completed: boolean;
}

export interface PaymentInfo {
    method: string;
    cardLast4?: string;
    cardBrand?: string;
    pixCode?: string;
    changeFor?: number;
}

export interface Coupon {
    code: string;
    discount: number;
    discountType: "percentage" | "fixed";
    minOrderValue?: number;
    expiresAt?: string;
}

export interface UserSettings {
    theme: "light" | "dark" | "system";
    notifications: {
        orderUpdates: boolean;
        promotions: boolean;
        newRestaurants: boolean;
    };
    language: string;
}

export interface FilterOptions {
    category?: string;
    minRating?: number;
    maxDeliveryTime?: number;
    maxDeliveryFee?: number;
    sortBy?: "distance" | "rating" | "delivery_time" | "delivery_fee";
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface AuthSession {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    image: string;
}

// Extra Groups for Product Customization
export interface ExtraGroup {
    id: string;
    name: string;
    required: boolean;
    minSelection: number;
    maxSelection: number;
    extras: Extra[];
}

// Product Size
export interface ProductSize {
    id: string;
    name: string;
    price: number;
}

// Review with Rating
export interface Review {
    id: string;
    orderId: string;
    userId: string;
    restaurantId: string;
    foodRating: number;
    deliveryRating: number;
    comment?: string;
    tags: string[];
    createdAt: string;
}

// Chat Message Sender Type
export type MessageSender = "user" | "driver" | "restaurant";

export interface ChatMessageWithSender extends ChatMessage {
    senderType: MessageSender;
    senderAvatar?: string;
}

