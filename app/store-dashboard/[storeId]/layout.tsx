import { redirect } from 'next/navigation'

import { Navbar } from '@/components/admin/navbar'
import { getStoreByIdCached } from '@/lib/cache'

export const metadata = {
    title: 'Admin dashboard',
    description: 'Admin dashboard for stores management',
}

interface Props {
    children: React.ReactNode
    params: Promise<{ storeId: string }>
}

export default async function layout({ children, params }: Props) {
    const { storeId } = await params

    const store = await getStoreByIdCached(parseInt(storeId) || 0)

    if (!store) {
        redirect('/admin')
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}
