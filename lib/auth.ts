'use server'

import { User } from '@/db/schema'
import { cookies } from 'next/headers'

type AuthObj = {
    user: User
    accessToken: string
    refreshToken: string
}

export async function auth(): Promise<AuthObj> {
    const cookiesStore = await cookies()
    const tokens = JSON.parse(cookiesStore.get('auth.tokens')?.value || '""')
    const user = JSON.parse(cookiesStore.get('auth.user')?.value || '""')

    const obj: AuthObj = {
        user: user || null,
        accessToken: tokens?.accessToken || null,
        refreshToken: tokens?.refreshToken || null,
    }

    return obj
}

export async function storeAuth(values: { user?: User; accessToken: string; refreshToken: string }) {
    const cookiesStore = await cookies()
    const { user, accessToken, refreshToken } = values

    cookiesStore.set('auth.tokens', JSON.stringify({ accessToken, refreshToken }), {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
    })

    if (user) {
        cookiesStore.set('auth.user', JSON.stringify(user), {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        })
    }
}

export async function destroyAuth() {
    const cookiesStore = await cookies()
    cookiesStore.delete('auth.tokens')
    cookiesStore.delete('auth.user')
}
