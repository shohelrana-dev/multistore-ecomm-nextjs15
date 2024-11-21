import { hc } from 'hono/client'
import { jwtDecode } from 'jwt-decode'

import { SITE_URL } from '@/app-config'
import { ApiType } from '@/server/api'
import { auth, storeAuth } from './auth'

export const client = hc<ApiType>(SITE_URL, {
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
        const { accessToken, refreshToken } = await auth()
        const response = await fetch(input, {
            method: requestInit?.method,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: accessToken ? 'Bearer ' + accessToken : '',
                ...requestInit?.headers,
            },
            body: requestInit?.body ?? null,
        })

        if (response.status === 403) {
            const decoded = jwtDecode(accessToken!)
            if (decoded && decoded.exp! < Date.now() / 1000) {
                console.log('Token expired. Refreshing...')

                try {
                    const data = await refreshAccessToken(refreshToken!)
                    console.log('Refreshed token')
                    storeAuth({ accessToken: data.accessToken, refreshToken: data.refreshToken })
                    // Retry the original request
                    return retryOriginalRequest(input, requestInit!, data.accessToken)
                } catch (e: any) {
                    console.log(e.message)
                }
            }
        }

        return response
    },
})

async function refreshAccessToken(refreshToken: string) {
    const response = await fetch('/api/auth/refresh-token', {
        headers: {
            Authorization: 'Bearer ' + refreshToken,
        },
    })
    if (!response.ok) {
        throw new Error('Failed to refresh token')
    }
    return (await response.json()) as { accessToken: string; refreshToken: string }
}

async function retryOriginalRequest(
    input: RequestInfo | URL,
    requestInit: RequestInit,
    accessToken: string
) {
    return fetch(input, {
        method: requestInit?.method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + accessToken,
            ...requestInit?.headers,
        },
        body: requestInit?.body,
    })
}
