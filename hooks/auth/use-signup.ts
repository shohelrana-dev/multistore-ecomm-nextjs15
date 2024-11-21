import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<typeof client.api.v1.auth.signup.$post>
type ResposeType = InferResponseType<typeof client.api.v1.auth.signup.$post>

export function useSignup() {
    const router = useRouter()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.v1.auth.signup.$post({ json })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: (data) => {
            toast.success('Account created. Please check your email inbox to verify your account')
            router.push('/verify-email?email=' + data.email)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to signup')
        },
    })

    return mutation
}
