import { Metadata } from 'next'
import Link from 'next/link'

import { SITE_NAME } from '@/app-config'
import { LoginForm } from '@/components/auth/login-form'
import SocialLoginButtons from '@/components/auth/social-login-buttons'
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account with email and password',
}

export default function LoginPage() {
    return (
        <>
            <CardHeader className='text-center'>
                <h2 className='text-lg font-extrabold'>Login to {SITE_NAME}</h2>
                <p className='text-sm text-gray-500'>Welcome back! Please sign in to continue</p>
            </CardHeader>

            <CardContent className='pb-0'>
                <SocialLoginButtons />

                <Divider>OR</Divider>

                <LoginForm />
            </CardContent>
            <CardFooter className='block'>
                <Divider>Don&apos;t have an account?</Divider>
                <Link href='/signup'>
                    <Button variant='outline' className='w-full'>
                        Create an account
                    </Button>
                </Link>
            </CardFooter>
        </>
    )
}
