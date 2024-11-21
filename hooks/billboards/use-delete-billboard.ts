import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<
    (typeof client.api.v1.stores)[':storeId']['billboards'][':billboardId']['$delete']
>
type ResposeType = InferResponseType<
    (typeof client.api.v1.stores)[':storeId']['billboards'][':billboardId']['$delete']
>

export function useDeleteBillboard() {
    const router = useRouter()
    const pathname = usePathname()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['billboards'],
        mutationFn: async ({ param }) => {
            const response = await client.api.v1.stores[':storeId'].billboards[':billboardId'].$delete({
                param,
            })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: (data) => {
            toast.success('Billboard deleted')
            if (pathname === `/store-dashboard/${data.storeId}/billboards`) {
                router.refresh()
            } else {
                router.push(`/store-dashboard/${data.storeId}/billboards`)
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete billboard')
        },
    })

    return mutation
}
