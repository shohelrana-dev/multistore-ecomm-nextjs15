import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<
    (typeof client.api.v1.stores)[':storeId']['categories'][':categoryId']['$delete']
>
type ResposeType = InferResponseType<
    (typeof client.api.v1.stores)[':storeId']['categories'][':categoryId']['$delete']
>

export function useDeleteCategory() {
    const router = useRouter()
    const pathname = usePathname()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['categories'],
        mutationFn: async ({ param }) => {
            const response = await client.api.v1.stores[':storeId'].categories[':categoryId'].$delete({
                param,
            })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: (data) => {
            toast.success('category deleted')
            if (pathname === `/store-dashboard/${data.storeId}/categories`) {
                router.refresh()
            } else {
                router.push(`/store-dashboard/${data.storeId}/categories`)
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete category')
        },
    })

    return mutation
}
