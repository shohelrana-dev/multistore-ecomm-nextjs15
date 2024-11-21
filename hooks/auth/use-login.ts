import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { storeAuth } from '@/lib/auth'
import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<(typeof client.api.v1.auth.login)['$post']>
type ResposeType = InferResponseType<(typeof client.api.v1.auth.login)['$post']>

export function useLogin() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.v1.auth.login.$post({ json })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: async (data) => {
            toast.success('Logged in')
            await storeAuth({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            })
            router.push(searchParams.get('redirect_url') || '/')
        },
        onError: (error, { json }) => {
            if (error.code === 403) {
                router.replace('/verify-email?email=' + json.email)
            }
            toast.error(error.message || 'Failed to login')
        },
    })

    return mutation
}
