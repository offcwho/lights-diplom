import { categoriesApi, productsApi } from '@/lib/api';
import { CategoriesPageUi } from '@/entities/catalog/ui/categories-page.ui';

export const metadata = {
    title: 'Коллекции — Свет.Ру',
    description: 'Все категории светильников',
};

export default async function CategoriesPage() {
    const [categories, productsPage] = await Promise.all([
        categoriesApi.list().catch(() => []),
        productsApi.list({ limit: 1 }).catch(() => ({ total: 0 })),
    ]);

    return (
        <CategoriesPageUi
            categories={categories}
            totalProducts={(productsPage as { total: number }).total}
        />
    );
}
