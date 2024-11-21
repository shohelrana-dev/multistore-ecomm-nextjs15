'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { Card } from '@/components/ui/card'
import { Loader } from '@/components/ui/loader'
import { useLoginWithCode } from '@/hooks/auth/use-login-with-code'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { mutate, isPending } = useLoginWithCode()
    const ref = useRef({ ignore: false })
    const searchParams = useSearchParams()
    const code = searchParams.get('code')

    useEffect(() => {
        if (code && !ref.current.ignore) {
            ref.current.ignore = true
            mutate({ json: { code } })
        }
    }, [code, mutate])

    return (
        <main className='min-h-screen flex flex-col items-center justify-center bg-light-gray'>
            <Card className='w-full max-w-[380px] mb-32 bg-white'>
                {!!code || isPending ? <Loader /> : children}
            </Card>
        </main>
    )
}
