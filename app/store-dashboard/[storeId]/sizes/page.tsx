import { format } from 'date-fns'
import { Metadata } from 'next'

import { SizeClient } from '@/components/admin/size-client'
import { getStoreByIdCached } from '@/lib/cache'
import { getSizesByStoreId } from '@/services/sizes.service'

interface Props {
    params: Promise<{ storeId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { storeId } = await params
    const store = await getStoreByIdCached(parseInt(storeId) || 0)

    return {
        title: 'Sizes for ' + store.name,
    }
}

export default async function BillboardsPage({ params }: Props) {
    const { storeId } = await params
    const sizes = await getSizesByStoreId(parseInt(storeId) || 0)

    const formattedSizes = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }))

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SizeClient data={formattedSizes} />
            </div>
        </div>
    )
}
