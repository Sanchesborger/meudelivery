// Order Status
export const ORDER_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PREPARING: "preparing",
    READY: "ready",
    PICKED_UP: "picked_up",
    ON_THE_WAY: "on_the_way",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    [ORDER_STATUS.PENDING]: "Aguardando confirmação",
    [ORDER_STATUS.CONFIRMED]: "Confirmado",
    [ORDER_STATUS.PREPARING]: "Preparando",
    [ORDER_STATUS.READY]: "Pronto para retirada",
    [ORDER_STATUS.PICKED_UP]: "Saiu para entrega",
    [ORDER_STATUS.ON_THE_WAY]: "A caminho",
    [ORDER_STATUS.DELIVERED]: "Entregue",
    [ORDER_STATUS.CANCELLED]: "Cancelado",
};

// Payment Methods
export const PAYMENT_METHODS = {
    PIX: "pix",
    CREDIT_CARD: "credit_card",
    DEBIT_CARD: "debit_card",
    CASH: "cash",
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    [PAYMENT_METHODS.PIX]: "PIX",
    [PAYMENT_METHODS.CREDIT_CARD]: "Cartão de Crédito",
    [PAYMENT_METHODS.DEBIT_CARD]: "Cartão de Débito",
    [PAYMENT_METHODS.CASH]: "Dinheiro",
};

// Delivery Types
export const DELIVERY_TYPES = {
    DELIVERY: "delivery",
    PICKUP: "pickup",
} as const;

export type DeliveryType = typeof DELIVERY_TYPES[keyof typeof DELIVERY_TYPES];

// Categories with Lucide icon names
export const CATEGORIES = [
    { id: "pizza", name: "Pizza", icon: "Pizza" },
    { id: "burger", name: "Hambúrguer", icon: "Beef" },
    { id: "japanese", name: "Japonesa", icon: "Fish" },
    { id: "pasta", name: "Massas", icon: "Soup" },
    { id: "dessert", name: "Sobremesas", icon: "IceCream" },
    { id: "drinks", name: "Bebidas", icon: "Coffee" },
    { id: "healthy", name: "Saudável", icon: "Salad" },
    { id: "brazilian", name: "Brasileira", icon: "UtensilsCrossed" },
    { id: "mexican", name: "Mexicana", icon: "Flame" },
    { id: "chinese", name: "Chinesa", icon: "Soup" },
] as const;

// App Configuration
export const APP_CONFIG = {
    name: "DeliveryX",
    description: "Peça comida com facilidade",
    version: "1.0.0",
    defaultLocation: {
        lat: -23.5505,
        lng: -46.6333,
    },
    mapConfig: {
        defaultZoom: 14,
        maxZoom: 18,
        minZoom: 10,
    },
    deliveryRadius: 10000, // 10km in meters
    minOrderValue: 10, // R$ 10.00
    deliveryFee: 5, // R$ 5.00
} as const;

// Validation Rules
export const VALIDATION = {
    phone: {
        minLength: 10,
        maxLength: 11,
    },
    password: {
        minLength: 6,
        maxLength: 50,
    },
    name: {
        minLength: 3,
        maxLength: 100,
    },
    address: {
        minLength: 5,
        maxLength: 200,
    },
    observation: {
        maxLength: 500,
    },
} as const;

// Time Constants
export const TIME = {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
    auth: {
        login: "/api/auth/login",
        logout: "/api/auth/logout",
        signup: "/api/auth/signup",
        verifyOtp: "/api/auth/verify-otp",
    },
    restaurants: {
        list: "/api/restaurants",
        detail: (id: string) => `/api/restaurants/${id}`,
        menu: (id: string) => `/api/restaurants/${id}/menu`,
    },
    orders: {
        create: "/api/orders",
        list: "/api/orders",
        detail: (id: string) => `/api/orders/${id}`,
        track: (id: string) => `/api/orders/${id}/track`,
    },
    user: {
        profile: "/api/user/profile",
        addresses: "/api/user/addresses",
        favorites: "/api/user/favorites",
    },
    search: "/api/search",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    cart: "deliveryx_cart",
    user: "deliveryx_user",
    theme: "deliveryx_theme",
    address: "deliveryx_address",
    recentSearches: "deliveryx_recent_searches",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    network: "Erro de conexão. Verifique sua internet.",
    unauthorized: "Você precisa estar logado para continuar.",
    notFound: "Recurso não encontrado.",
    serverError: "Erro no servidor. Tente novamente mais tarde.",
    invalidCredentials: "Credenciais inválidas.",
    invalidPhone: "Número de telefone inválido.",
    invalidEmail: "E-mail inválido.",
    invalidCPF: "CPF inválido.",
    requiredField: "Este campo é obrigatório.",
    minOrderValue: `Valor mínimo do pedido: R$ ${APP_CONFIG.minOrderValue.toFixed(2)}`,
    outOfDeliveryRadius: "Endereço fora da área de entrega.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    orderPlaced: "Pedido realizado com sucesso!",
    profileUpdated: "Perfil atualizado com sucesso!",
    addressAdded: "Endereço adicionado com sucesso!",
    addressUpdated: "Endereço atualizado com sucesso!",
    addressDeleted: "Endereço removido com sucesso!",
    favoriteAdded: "Adicionado aos favoritos!",
    favoriteRemoved: "Removido dos favoritos!",
} as const;

// Menu Categories for Restaurant Menus
export const MENU_CATEGORIES = [
    { id: "popular", name: "Mais Pedidos", icon: "TrendingUp" },
    { id: "pizzas", name: "Pizzas", icon: "Pizza" },
    { id: "burgers", name: "Hambúrgueres", icon: "Beef" },
    { id: "pasta", name: "Massas", icon: "Soup" },
    { id: "salads", name: "Saladas", icon: "Salad" },
    { id: "desserts", name: "Sobremesas", icon: "IceCream" },
    { id: "drinks", name: "Bebidas", icon: "Coffee" },
    { id: "combos", name: "Combos", icon: "Package" },
] as const;

// Product Sizes
export const PRODUCT_SIZES = [
    { id: "small", name: "Pequeno", multiplier: 0.8 },
    { id: "medium", name: "Médio", multiplier: 1.0 },
    { id: "large", name: "Grande", multiplier: 1.3 },
] as const;

// Chat Quick Replies
export const QUICK_REPLIES = [
    "Está a caminho?",
    "Quanto tempo falta?",
    "Onde está o pedido?",
    "Pode tocar a campainha?",
    "Obrigado!",
] as const;

// Review Feedback Tags
export const FEEDBACK_TAGS = [
    { id: "fast", label: "Entrega Rápida", icon: "Zap" },
    { id: "hot", label: "Comida Quente", icon: "Flame" },
    { id: "packaged", label: "Bem Embalado", icon: "Package" },
    { id: "polite", label: "Entregador Educado", icon: "Heart" },
    { id: "accurate", label: "Pedido Correto", icon: "CheckCircle" },
    { id: "tasty", label: "Muito Saboroso", icon: "Star" },
] as const;

// Order Cancellation Reasons
export const CANCELLATION_REASONS = [
    "Demora na entrega",
    "Mudei de ideia",
    "Fiz o pedido errado",
    "Preço muito alto",
    "Restaurante não confirmou",
    "Outro motivo",
] as const;
