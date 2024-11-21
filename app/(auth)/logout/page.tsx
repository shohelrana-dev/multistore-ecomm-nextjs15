'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { LOGIN_URL } from '@/app-config'
import { destroyAuth } from '@/lib/auth'
import { client } from '@/lib/hono-client'
import Loader from '../loading'

export default function LogoutPage() {
    const router = useRouter()

    useEffect(() => {
        const logout = async () => {
            await client.api.auth.logout.$get()
            await destroyAuth()
            router.refresh()
            router.push(LOGIN_URL)
        }
        logout()
    }, [router])

    return <Loader />
}
