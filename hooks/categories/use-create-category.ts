import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<(typeof client.api.v1.stores)[':storeId']['categories']['$post']>
type ResposeType = InferResponseType<(typeof client.api.v1.stores)[':storeId']['categories']['$post']>

export function useCreateCategory() {
    const router = useRouter()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['categories'],
        mutationFn: async ({ json, param }) => {
            const response = await client.api.v1.stores[':storeId'].categories.$post({
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
            toast.success('Category created')
            router.push(`/store-dashboard/${data.storeId}/categories`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create category')
        },
    })

    return mutation
}
