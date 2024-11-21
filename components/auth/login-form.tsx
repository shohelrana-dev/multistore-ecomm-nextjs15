'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form } from '@/components/ui/form'
import { InputGroup } from '@/components/ui/input-group'
import { SubmitButton } from '@/components/ui/submit-button'
import { useLogin } from '@/hooks/auth/use-login'
import { loginSchema } from '@/lib/zod'

export function LoginForm() {
    const form = useForm<z.infer<typeof loginSchema>>({
        mode: 'all',
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })
    const { mutate, isPending } = useLogin()

    async function processForm(values: z.infer<typeof loginSchema>) {
        mutate({ json: values })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)}>
                <InputGroup label='Email' name='email' form={form} />
                <InputGroup label='Password' name='password' type='password' form={form} />
                <p className='text-right -mt-1'>
                    <Link href='/forgot-password' className='text-foreground text-xs'>
                        Forgot Password
                    </Link>
                </p>

                <SubmitButton isSubmitting={isPending} className='w-full mt-2'>
                    Login
                </SubmitButton>
            </form>
        </Form>
    )
}
