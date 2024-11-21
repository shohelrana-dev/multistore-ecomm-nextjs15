import { headers } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import facebook from '@/assets/facebook.svg'
import google from '@/assets/google.svg'
import { SubmitButton } from '@/components/ui/submit-button'

export default async function SocialLoginButtons() {
    return (
        <div className='flex gap-2'>
            <form
                className='w-full'
                action={async () => {
                    'use server'
                    const headersList = await headers()
                    redirect('/api/auth/google?callback_url=' + headersList.get('referer'))
                }}
            >
                <SubmitButton variant='outline' className='w-full'>
                    <Image src={google} alt={'Google'} width={20} height={20} /> Google
                </SubmitButton>
            </form>

            <form
                className='w-full'
                action={async () => {
                    'use server'
                    const headersList = await headers()
                    redirect('/api/auth/facebook?callback_url=' + headersList.get('referer'))
                }}
            >
                <SubmitButton variant='outline' className='w-full'>
                    <Image src={facebook} alt={'Facebook'} width={20} height={20} /> Facebook
                </SubmitButton>
            </form>
        </div>
    )
}
