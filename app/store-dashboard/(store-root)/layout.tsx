import { auth } from '@/lib/auth'
import { getLastStoreByUserId } from '@/services/stores.service'
import { redirect } from 'next/navigation'

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
    const { user } = await auth()

    const store = await getLastStoreByUserId(user.id)
    if (store) {
        redirect('/store-dashboard/' + store.id)
    }

    return <>{children}</>
}
