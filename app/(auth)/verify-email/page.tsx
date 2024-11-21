'use client'

import { VerifyEmailForm } from '@/components/auth/verify-email-form'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Suspense } from 'react'
import Loader from '../loading'

export default function VerifyEmailPage() {
    return (
        <>
            <CardHeader className='text-center'>
                <h2 className='text-lg font-extrabold'>Verify your email</h2>
                <p className='text-sm text-gray-500'>Check your email for a verification code.</p>
            </CardHeader>

            <CardContent>
                <Suspense fallback={<Loader />}>
                    <VerifyEmailForm />
                </Suspense>
            </CardContent>
        </>
    )
}
