import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<(typeof client.api.v1.stores)[':storeId']['billboards']['$post']>
type ResposeType = InferResponseType<(typeof client.api.v1.stores)[':storeId']['billboards']['$post']>

export function useCreateBillboard() {
    const router = useRouter()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['billboards'],
        mutationFn: async ({ json, param }) => {
            const response = await client.api.v1.stores[':storeId'].billboards.$post({
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
            toast.success('Billboard created')
            router.push(`/store-dashboard/${data.storeId}/billboards`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create billboard')
        },
    })

    return mutation
}
