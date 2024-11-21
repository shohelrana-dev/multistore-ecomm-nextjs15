'use server'

import { cookies } from 'next/headers'

export async function getAuthTokensFromServerCookie() {
    const cookiesStore = await cookies()
    return {
        accessToken: cookiesStore.get('__access_token')?.value || '',
        refreshToken: cookiesStore.get('__refresh_token')?.value || '',
    }
}
