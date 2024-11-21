import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<(typeof client.api.v1.stores)[':storeId']['$patch']>
type ResposeType = InferResponseType<(typeof client.api.v1.stores)[':storeId']['$patch']>

export function useUpdateStore() {
    const router = useRouter()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['stores'],
        mutationFn: async ({ json, param }) => {
            const response = await client.api.v1.stores[':storeId'].$patch({
                json,
                param,
            })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: () => {
            toast.success('Store updated')
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update store')
        },
    })

    return mutation
}
