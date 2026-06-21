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

export interface Review {
    id: string;
    productId: string;
    userId: string;
    user: Pick<User, 'id' | 'name' | 'avatarUrl'>;
    rating: number;
    comment: string;
    createdAt: string;
}