import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<(typeof client.api.v1.stores)[':storeId']['$delete']>
type ResposeType = InferResponseType<(typeof client.api.v1.stores)[':storeId']['$delete']>

export function useDeleteStore() {
    const router = useRouter()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['stores'],
        mutationFn: async ({ param }) => {
            const response = await client.api.v1.stores[':storeId'].$delete({
                param,
            })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: () => {
            toast.success('Store deleted.')
            router.refresh()
            router.push('/admin')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete store')
        },
    })

    return mutation
}
