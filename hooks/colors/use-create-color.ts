import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<(typeof client.api.v1.stores)[':storeId']['colors']['$post']>
type ResposeType = InferResponseType<(typeof client.api.v1.stores)[':storeId']['colors']['$post']>

export function useCreateColor() {
    const router = useRouter()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['colors'],
        mutationFn: async ({ json, param }) => {
            const response = await client.api.v1.stores[':storeId'].colors.$post({
                json,
                param,
            })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: (data) => {
            toast.success('Color created')
            router.push(`/store-dashboard/${data.storeId}/colors`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create color')
        },
    })

    return mutation
}