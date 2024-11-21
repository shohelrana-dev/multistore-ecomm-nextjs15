import { CategoryForm } from '@/components/admin/category-form'
import { getBillboardsByStoreId } from '@/services/billboards.service'
import { getCategoryById } from '@/services/categories.service'
import { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { categoryId } = await params
    const category = await getCategoryById(parseInt(categoryId) || 0)

    if (category) {
        return {
            title: 'Edit category: ' + category.name,
        }
    } else {
        return {
            title: 'Add new category',
        }
    }
}

interface Props {
    params: Promise<{
        categoryId: string
        storeId: string
    }>
}

export default async function SingleCategoryPage({ params }: Props) {
    const { categoryId, storeId } = await params

    const [category, billboards] = await Promise.all([
        getCategoryById(parseInt(categoryId) || 0),
        getBillboardsByStoreId(parseInt(storeId) || 0),
    ])

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <CategoryForm initialData={category} billboards={billboards} />
            </div>
        </div>
    )
}
