import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<
    (typeof client.api.v1.stores)[':storeId']['sizes'][':sizeId']['$delete']
>
type ResposeType = InferResponseType<
    (typeof client.api.v1.stores)[':storeId']['sizes'][':sizeId']['$delete']
>

export function useDeleteSize() {
    const router = useRouter()
    const pathname = usePathname()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['sizes'],
        mutationFn: async ({ param }) => {
            const response = await client.api.v1.stores[':storeId'].sizes[':sizeId'].$delete({
                param,
            })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: (data) => {
            toast.success('Size deleted')
            if (pathname === `/store-dashboard/${data.storeId}/sizes`) {
                router.refresh()
            } else {
                router.push(`/store-dashboard/${data.storeId}/sizes`)
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete size')
        },
    })

    return mutation
}
