import { format } from 'date-fns'
import { Metadata } from 'next'

import { CURRENCY } from '@/app-config'
import { ProductClient } from '@/components/admin/product-client'
import { getStoreByIdCached } from '@/lib/cache'
import { truncateString } from '@/lib/utils'
import { getProductsByStoreId } from '@/services/products.service'

interface Props {
    params: Promise<{ storeId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { storeId } = await params
    const store = await getStoreByIdCached(parseInt(storeId) || 0)

    return {
        title: 'Products for ' + store.name,
    }
}

export default async function ProductsPage({ params }: Props) {
    const { storeId } = await params
    const products = await getProductsByStoreId(parseInt(storeId) || 0)

    const formattedProducts = products.map((product) => ({
        id: product.id,
        name: truncateString(product.name),
        price: (product.discountPrice || product.price) + CURRENCY,
        thumbnail: product.thumbnail,
        stock: product.stock,
        slug: product.slug,
        featured: product.featured,
        archived: product.archived,
        status: product.status,
        createdAt: format(product.createdAt, 'MMMM do, yyyy'),
    }))

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )
}
