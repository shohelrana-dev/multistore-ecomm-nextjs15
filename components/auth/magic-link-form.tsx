'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { InputGroup } from '@/components/ui/input-group'
import { SubmitButton } from '@/components/ui/submit-button'
import { emailValidation } from '@/lib/zod'
import { Form } from '../ui/form'

export function MagicLinkForm() {
    const form = useForm<{ email: string }>({
        mode: 'all',
        resolver: zodResolver(z.object({ email: emailValidation })),
    })

    async function processForm({ email }: { email: string }) {
        console.log(email)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)} className='flex flex-col gap-3'>
                <InputGroup label='Email' type='text' name='email' form={form} />
                <SubmitButton>Login with magic link</SubmitButton>
            </form>
        </Form>
    )
}
