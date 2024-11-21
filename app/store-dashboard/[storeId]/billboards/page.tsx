import { format } from 'date-fns'
import { Metadata } from 'next'

import { BillboardClient } from '@/components/admin/billboard-client'
import { getStoreByIdCached } from '@/lib/cache'
import { getBillboardsByStoreId } from '@/services/billboards.service'

interface Props {
    params: Promise<{ storeId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { storeId } = await params
    const store = await getStoreByIdCached(parseInt(storeId) || 0)

    return {
        title: 'Billboards for ' + store.name,
    }
}

export default async function BillboardsPage({ params }: Props) {
    const { storeId } = await params
    const billboards = await getBillboardsByStoreId(parseInt(storeId) || 0)

    const formattedBillboards = billboards.map((billboard) => ({
        id: billboard.id,
        title: billboard.title,
        createdAt: format(billboard.createdAt, 'MMMM do, yyyy'),
    }))

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    )
}
