// Types matching the luxf.light NestJS API responses.

export type ProductColor =
    | 'white_ivory'
    | 'architectural_grey'
    | 'carbon_black'
    | 'olive_green';

export type ProductSort = 'popular' | 'price_asc' | 'price_desc' | 'newest';

export type OrderStatus = 'new' | 'paid' | 'shipped' | 'sent' | 'completed' | 'cancelled';

export type UserRole = 'user' | 'admin';

export interface Category {
    id: string;
    name: string;
    slug: string;
    productCount?: number;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    price: number;
    categoryId?: string | null;
    category: Category;
    color?: ProductColor | null;
    material?: string | null;
    images: string[];
    isOnSale: boolean;
    discountPercent: number;
    popularity: number;
    stock: number;
    attributes?: { name: string; value: string }[] | null;
    spec?: ProductSpec | null;
    createdAt: string;
    updatedAt: string;
}

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface FavouriteItem {
    id: string;
    user: User;
    product: Product;
}

export interface ProductQuery {
    category?: string;
    color?: ProductColor;
    minPrice?: number;
    maxPrice?: number;
    onSale?: boolean;
    search?: string;
    sort?: ProductSort;
    page?: number;
    limit?: number;
    // Spec filters (comma-separated values)
    styles?: string;
    rooms?: string;
    shapes?: string;
    lampTypes?: string;
    mountingTypes?: string;
    frameMaterials?: string;
    frameColors?: string;
    colorTemps?: string;
    minPowerW?: number;
}

export interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    product: Product;
}

export interface Cart {
    id: string;
    items: CartItem[];
    count: number;
    total: number;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string | null;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    shippingAddress?: string | null;
    phone?: string | null;
    createdAt: string;
}

export interface Address {
    id: string;
    label?: string | null;
    city: string;
    street: string;
    house: string;
    apartment?: string | null;
    zipCode?: string | null;
    isDefault: boolean;
    createdAt: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
    address?: string | null;
    avatarUrl: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    accessToken: string;
    user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'address' | 'avatarUrl' | 'phone'>;
}

export interface Banner {
    id: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    imageUrl: string;
    action?: string | null;
    buttonLabel?: string | null;
    isActive: boolean;
    order: number;
}

export interface ProductSpec {
    id: string;
    productId: string;
    model?: string | null;
    weightKg?: number | null;
    shapes: string[];
    styles: string[];
    rooms: string[];
    lampType?: string | null;
    maxAreaM2?: number | null;
    mountingType?: string | null;
    frameMaterial?: string | null;
    frameColor?: string | null;
    shadeMaterials: string[];
    shadeColors: string[];
    colorTemps: string[];
    powerW?: number | null;
    lumens?: number | null;
    lampCount?: number | null;
}

export interface PromoCode {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount?: number | null;
    maxUses?: number | null;
    usedCount: number;
    isActive: boolean;
    expiresAt?: string | null;
}

export interface Characteristic {
    id: string;
    name: string;
    type: string;
}

export interface ProductFilters {
    shapes: string[];
    styles: string[];
    rooms: string[];
    lampTypes: string[];
    mountingTypes: string[];
    frameMaterials: string[];
    frameColors: string[];
    colorTemps: string[];
}

export type SupportStatus = 'new' | 'in_progress' | 'closed';

export interface SupportTicket {
    id: string;
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    status: SupportStatus;
    userId?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewQuestion {
    id: string;
    reviewId: string;
    userId: string;
    user: Pick<User, 'id' | 'name' | 'avatarUrl'>;
    text: string;
    createdAt: string;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    user: Pick<User, 'id' | 'name' | 'avatarUrl'>;
    rating: number;
    title?: string | null;
    body: string;
    createdAt: string;
    questions: ReviewQuestion[];
}