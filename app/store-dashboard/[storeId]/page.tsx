import { getStoreByIdCached } from '@/lib/cache'
import { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { storeId } = await params
    const store = await getStoreByIdCached(parseInt(storeId) || 0)

    return {
        title: 'Store overview for ' + store.name,
    }
}

interface Props {
    params: Promise<{ storeId: string }>
}

export default async function DashboardPage({ params }: Props) {
    const { storeId } = await params
    const store = await getStoreByIdCached(parseInt(storeId) || 0)

    return <div>Store: {store?.name}</div>
}
