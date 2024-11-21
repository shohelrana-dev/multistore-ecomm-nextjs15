'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form } from '@/components/ui/form'
import { InputGroup } from '@/components/ui/input-group'
import { SubmitButton } from '@/components/ui/submit-button'
import { useSignup } from '@/hooks/auth/use-signup'
import { signupSchema } from '@/lib/zod'

export function SignupForm() {
    const form = useForm<z.infer<typeof signupSchema>>({
        mode: 'all',
        resolver: zodResolver(signupSchema),
        defaultValues: { name: '', email: '', password: '' },
    })
    const { mutate, isPending } = useSignup()

    async function processForm(values: z.infer<typeof signupSchema>) {
        mutate({ json: values })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)}>
                <InputGroup label='Name' name='name' form={form} />
                <InputGroup label='Email' name='email' form={form} />
                <InputGroup label='Password' name='password' type='password' form={form} />

                <SubmitButton isSubmitting={isPending} className='w-full mt-3'>
                    Continue
                </SubmitButton>
            </form>
        </Form>
    )
}
