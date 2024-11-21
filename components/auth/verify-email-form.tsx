'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { SubmitButton } from '@/components/ui/submit-button'
import { useResendVerificationEmail } from '@/hooks/auth/use-resend-verification-email'
import { useVerifyEmail } from '@/hooks/auth/use-verify-email'
import { EmailVerificationFromValues, emailVerificationSchema } from '@/lib/zod'

export function VerifyEmailForm() {
    const router = useRouter()
    const { register, handleSubmit, formState } = useForm<EmailVerificationFromValues>({
        mode: 'all',
        resolver: zodResolver(emailVerificationSchema),
    })
    const { mutateAsync: verify, isPending: isVerifying } = useVerifyEmail()
    const { mutateAsync: resendEmail, isSuccess: isResendSuccess } = useResendVerificationEmail()
    const searchParams = useSearchParams()

    const email = searchParams.get('email')
    const code = register('code')

    async function processForm(values: EmailVerificationFromValues) {
        await verify({ json: values })
    }

    async function processResendForm() {
        await resendEmail({ json: { email: email! } })
    }

    if (!email) {
        router.push('/login')
        return null
    }

    return (
        <>
            <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-4'>
                <input type='hidden' value={email} {...register('email')} />
                <InputOTP
                    maxLength={6}
                    name={code.name}
                    ref={code.ref}
                    onBlur={code.onBlur}
                    containerClassName='self-center'
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                {formState.errors.code && (
                    <p className='text-destructive text-[13px] -mt-1 text-center'>
                        <Info size={16} className='inline-block mr-1' />
                        <span>{formState.errors.code.message?.toString()}</span>
                    </p>
                )}
                <SubmitButton isSubmitting={isVerifying}>Verify</SubmitButton>
            </form>

            {!!isResendSuccess ? (
                <p className='text-sm text-gray-500 text-center mt-5'>Email resent.</p>
            ) : (
                <form action={processResendForm} className='flex flex-col gap-4'>
                    <p className='text-sm text-gray-500 text-center mt-5'>
                        Didn&apos;t receive the email? <br />
                        <SubmitButton variant='link'>Resend</SubmitButton>
                    </p>
                </form>
            )}
        </>
    )
}
