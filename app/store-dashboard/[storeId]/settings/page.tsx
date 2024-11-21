import { redirect } from 'next/navigation'

import { SettingsForm } from '@/components/admin/settings-form'
import { getStoreByIdCached } from '@/lib/cache'
import { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { storeId } = await params
    const store = await getStoreByIdCached(parseInt(storeId) || 0)

    return {
        title: 'Store settings for ' + store.name,
        description: 'Manage store settings from this page',
    }
}

type Props = {
    params: Promise<{ storeId: string }>
}

export default async function SettingsPage({ params }: Props) {
    const { storeId } = await params

    const store = await getStoreByIdCached(parseInt(storeId) || 0)

    if (!store) {
        redirect('/admin')
    }

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SettingsForm initialData={store} />
            </div>
        </div>
    )
}
