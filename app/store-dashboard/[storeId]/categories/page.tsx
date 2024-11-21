import { format } from 'date-fns'
import { Metadata } from 'next'

import { CategoryClient } from '@/components/admin/category-client'
import { getStoreByIdCached } from '@/lib/cache'
import { getCategoriesByStoreId } from '@/services/categories.service'

interface Props {
    params: Promise<{ storeId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { storeId } = await params
    const store = await getStoreByIdCached(parseInt(storeId) || 0)

    return {
        title: 'Categories for ' + store.name,
    }
}

export default async function CategoriesPage({ params }: Props) {
    const { storeId } = await params
    const categories = await getCategoriesByStoreId(parseInt(storeId) || 0)

    const formattedCategories = categories.map((category) => ({
        id: category.id,
        name: category.name,
        billboardTitle: category.billboard?.title,
        createdAt: format(category.createdAt, 'MMMM do, yyyy'),
    }))

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <CategoryClient data={formattedCategories} />
            </div>
        </div>
    )
}
