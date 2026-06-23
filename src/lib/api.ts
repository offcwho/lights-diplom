import axios, { AxiosInstance } from 'axios';
import type {
    Address, AuthResponse, Banner, Cart, Category, Characteristic, Order, Paginated, Product, ProductFilters, ProductQuery, PromoCode, Review, ReviewQuestion, User,
} from './types';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9000/api';
const TOKEN_KEY = 'luxf_token';

/** JWT storage (client-side only — guarded for SSR). */
export const tokenStore = {
    get(): string | null {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(TOKEN_KEY);
    },
    set(token: string) {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(TOKEN_KEY, token);
        } else {
            console.log('set вызван на СЕРВЕРЕ — window нет, localStorage ПРОПУЩЕН');
        }
    },
    clear() {
        if (typeof window !== 'undefined') window.localStorage.removeItem(TOKEN_KEY);
    },
};

export const api: AxiosInstance = axios.create({ baseURL });

// Attach the Bearer token to every request.
api.interceptors.request.use((config) => {
    const token = tokenStore.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Drop the token on 401 so the app can redirect to login.
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 401) tokenStore.clear();
        return Promise.reject(error);
    },
);

/* ----------------------------- Auth ----------------------------- */
export const authApi = {
    async sendRegisterCode(dto: { name: string; email: string; password: string }) {
        await api.post('/auth/send-verification', dto);
    },
    async verifyRegisterCode(dto: { email: string; code: string }) {
        const { data } = await api.post<AuthResponse>('/auth/verify-email', dto);
        tokenStore.set(data.accessToken);
        return data;
    },
    async register(dto: { email: string; password: string; name?: string }) {
        const { data } = await api.post<AuthResponse>('/auth/register', dto);
        tokenStore.set(data.accessToken);
        return data;
    },
    async login(dto: { email: string; password: string }) {
        const { data } = await api.post<AuthResponse>('/auth/login', dto);
        tokenStore.set(data.accessToken);
        return data;
    },
    async forgotPassword(email: string) {
        await api.post('/auth/forgot-password', { email });
    },
    async resetPassword(dto: { email: string; code: string; newPassword: string }) {
        await api.post('/auth/reset-password', dto);
    },
    logout() {
        tokenStore.clear();
    },
    async me() {
        const { data } = await api.get<User>('/auth/me');
        return data;
    },
    isAuthenticated() {
        return !!tokenStore.get();
    },
};

/* --------------------------- Products --------------------------- */
export const productsApi = {
    async list(params?: ProductQuery) {
        const { data } = await api.get<Paginated<Product>>('/products', { params });
        return data;
    },
    async getBySlug(slug: string) {
        const { data } = await api.get<Product>(`/products/${slug}`);
        return data;
    },
    async getFilters() {
        const { data } = await api.get<ProductFilters>('/products/filters');
        return data;
    },
    async incrementPopularity(id: string) {
        await api.post(`/products/${id}/view`);
    },
};

/* -------------------------- Categories -------------------------- */
export const categoriesApi = {
    async list() {
        const { data } = await api.get<Category[]>('/categories');
        return data;
    },
    async getBySlug(slug: string) {
        const { data } = await api.get<Category>(`/categories/${slug}`);
        return data;
    },
};

/* ----------------------------- Cart ----------------------------- */
export const cartApi = {
    async get() {
        const { data } = await api.get<Cart>('/cart');
        return data;
    },
    async add(productId: string, quantity = 1) {
        const { data } = await api.post<Cart>('/cart/items', { productId, quantity });
        return data;
    },
    async updateItem(itemId: string, quantity: number) {
        const { data } = await api.patch<Cart>(`/cart/items/${itemId}`, { quantity });
        return data;
    },
    async removeItem(itemId: string) {
        const { data } = await api.delete<Cart>(`/cart/items/${itemId}`);
        return data;
    },
    async clear() {
        const { data } = await api.delete<Cart>('/cart');
        return data;
    },
};

/* -------------------------- Favourites -------------------------- */
export const favouritesApi = {
    async list() {
        const { data } = await api.get<Product[]>('/favourites');
        return data;
    },
    async add(productId: string) {
        const { data } = await api.post<Product[]>(`/favourites/${productId}`);
        return data;
    },
    async remove(productId: string) {
        const { data } = await api.delete<Product[]>(`/favourites/${productId}`);
        return data;
    },
};

/* ---------------------------- Orders ---------------------------- */
export const ordersApi = {
    async checkout(dto?: { shippingAddress?: string; phone?: string; promoCode?: string; discountAmount?: number }) {
        const { data } = await api.post<Order>('/orders', dto ?? {});
        return data;
    },
    async list() {
        const { data } = await api.get<Order[]>('/orders');
        return data;
    },
    async getOne(id: string) {
        const { data } = await api.get<Order>(`/orders/${id}`);
        return data;
    },
    async pay(id: string) {
        const { data } = await api.post<Order>(`/orders/${id}/pay`);
        return data;
    },
};

/* --------------------------- Addresses -------------------------- */
type AddressDto = { label?: string; city: string; street: string; house: string; apartment?: string; zipCode?: string; isDefault?: boolean };

export const addressesApi = {
    async list() {
        const { data } = await api.get<Address[]>('/addresses');
        return data;
    },
    async create(dto: AddressDto) {
        const { data } = await api.post<Address>('/addresses', dto);
        return data;
    },
    async update(id: string, dto: Partial<AddressDto>) {
        const { data } = await api.patch<Address>(`/addresses/${id}`, dto);
        return data;
    },
    async remove(id: string) {
        await api.delete(`/addresses/${id}`);
    },
};

/* ----------------------- Characteristics ------------------------ */
export const characteristicsApi = {
    async list() {
        const { data } = await api.get<Characteristic[]>('/characteristics');
        return data;
    },
};

/* ---------------------------- Banners --------------------------- */
export const bannersApi = {
    async list() {
        const { data } = await api.get<Banner[]>('/banners');
        return data;
    },
};

/* ---------------------------- Reviews --------------------------- */
export const reviewsApi = {
    async list(productId: string) {
        const { data } = await api.get<Review[]>('/reviews', { params: { productId } });
        return data;
    },
    async create(dto: { productId: string; rating: number; body: string; title?: string }) {
        const { data } = await api.post<Review>('/reviews', dto);
        return data;
    },
    async remove(id: string) {
        await api.delete(`/reviews/${id}`);
    },
    async addQuestion(reviewId: string, text: string) {
        const { data } = await api.post<ReviewQuestion>(`/reviews/${reviewId}/questions`, { text });
        return data;
    },
    async removeQuestion(id: string) {
        await api.delete(`/reviews/questions/${id}`);
    },
};

/* -------------------------- Promo codes ------------------------- */
export const promoCodesApi = {
    async apply(code: string, orderAmount: number) {
        const { data } = await api.post<PromoCode>('/promo-codes/apply', { code, orderAmount });
        return data;
    },
};

/* ----------------------------- User ----------------------------- */
export const usersApi = {
    async getProfile() {
        const { data } = await api.get<User>('/users/me');
        return data;
    },
    async updateProfile(dto: { name?: string; phone?: string; address?: string; avatarUrl?: string }) {
        const { data } = await api.patch<User>('/users/me', dto);
        return data;
    },
    async changePassword(dto: { currentPassword: string; newPassword: string }) {
        await api.patch('/users/me/password', dto);
    },
};