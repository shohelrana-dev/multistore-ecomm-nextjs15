import { auth } from '@/lib/auth'
import { getUserStores } from '@/services/stores.service'
import { UserButton } from '../user-button'
import { MainNav } from './main-nav'
import { StoreSwitcher } from './store-switcher'

export async function Navbar() {
    const { user } = await auth()
    const stores = await getUserStores(user.id)

    return (
        <header className='border-b'>
            <div className='flex h-16 items-center px-4'>
                <StoreSwitcher items={stores} />

                <MainNav className='mx-6' />

                <div className='ml-auto flex items-center space-x-4'>
                    <UserButton />
                </div>
            </div>
        </header>
    )
}
