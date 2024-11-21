import { ProductForm } from '@/components/admin/product-form'
import { getCategoriesByStoreId } from '@/services/categories.service'
import { getColorsByStoreId } from '@/services/colors.service'
import { getProductById } from '@/services/products.service'
import { getSizesByStoreId } from '@/services/sizes.service'
import { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { productId } = await params
    const product = await getProductById(parseInt(productId) || 0)

    if (product) {
        return {
            title: 'Edit product: ' + product.name,
        }
    } else {
        return {
            title: 'Add new product',
        }
    }
}

interface Props {
    params: Promise<{
        productId: string
        storeId: string
    }>
}

export default async function SingleProductPage({ params }: Props) {
    const { productId, storeId } = await params

    const [product, categories, sizes, colors] = await Promise.all([
        getProductById(parseInt(productId) || 0),
        getCategoriesByStoreId(parseInt(storeId) || 0),
        getSizesByStoreId(parseInt(storeId) || 0),
        getColorsByStoreId(parseInt(storeId) || 0),
    ])

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductForm
                    initialData={product}
                    categories={categories}
                    sizes={sizes}
                    colors={colors}
                />
            </div>
        </div>
    )
}
