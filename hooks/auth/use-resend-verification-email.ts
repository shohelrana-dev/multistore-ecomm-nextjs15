import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<(typeof client.api.v1.auth)['resend-verification-email']['$post']>
type ResposeType = InferResponseType<(typeof client.api.v1.auth)['resend-verification-email']['$post']>

export function useResendVerificationEmail() {
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.v1.auth['resend-verification-email'].$post({ json })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: () => {
            toast.success('Verification email resend was success. Please check your email inbox')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to resend verification email')
        },
    })

    return mutation
}
