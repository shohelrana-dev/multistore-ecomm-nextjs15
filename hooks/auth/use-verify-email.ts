import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<(typeof client.api.v1.auth)['verify-email']['$post']>
type ResposeType = InferResponseType<(typeof client.api.v1.auth)['verify-email']['$post']>

export function useVerifyEmail() {
    const router = useRouter()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.v1.auth['verify-email'].$post({ json })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: () => {
            toast.success('Email verified')
            router.push('/login')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to verify email')
        },
    })

    return mutation
}
