import { format } from 'date-fns'
import { Metadata } from 'next'

import { ColorClient } from '@/components/admin/color-client'
import { getStoreByIdCached } from '@/lib/cache'
import { getColorsByStoreId } from '@/services/colors.service'

interface Props {
    params: Promise<{ storeId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { storeId } = await params
    const store = await getStoreByIdCached(parseInt(storeId) || 0)

    return {
        title: 'Colors for ' + store.name,
    }
}

export default async function ColorsPage({ params }: Props) {
    const { storeId } = await params
    const colors = await getColorsByStoreId(parseInt(storeId) || 0)

    const formattedColors = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }))

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ColorClient data={formattedColors} />
            </div>
        </div>
    )
}
