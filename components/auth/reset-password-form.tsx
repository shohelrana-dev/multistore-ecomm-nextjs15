'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form } from '@/components/ui/form'
import { InputGroup } from '@/components/ui/input-group'
import { SubmitButton } from '@/components/ui/submit-button'
import { ResetPasswordFromValues, resetPasswordSchema } from '@/lib/zod'

export function ResetPasswordForm({ token }: { token: string }) {
    const form = useForm<ResetPasswordFromValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'all',
    })

    async function processForm(values: ResetPasswordFromValues) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)} className='flex flex-col gap-4'>
                <input type='hidden' value={token} name='token' />
                <InputGroup type='password' label='Password' name='password' form={form} />
                <InputGroup
                    type='password'
                    label='Confirm password'
                    name='confirm-password'
                    form={form}
                />
                <SubmitButton>Reset Password</SubmitButton>
            </form>
        </Form>
    )
}
