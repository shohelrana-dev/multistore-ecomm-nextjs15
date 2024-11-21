'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { InputGroup } from '@/components/ui/input-group'
import { SubmitButton } from '@/components/ui/submit-button'
import { emailValidation } from '@/lib/zod'
import { Form } from '../ui/form'

export function ForgotPasswordForm() {
    const form = useForm<{ email: string }>({
        resolver: zodResolver(z.object({ email: emailValidation })),
        mode: 'all',
    })

    async function processForm({ email }: { email: string }) {
        console.log(email)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)} className='flex flex-col gap-4'>
                <InputGroup label='Email' name='email' form={form} />
                <SubmitButton>Send Reset Link</SubmitButton>
            </form>
        </Form>
    )
}
