import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<typeof client.api.v1.products.$post>
type ResposeType = InferResponseType<typeof client.api.v1.products.$post>

export function useCreateProduct() {
    const router = useRouter()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['products'],
        mutationFn: async ({ json }) => {
            const response = await client.api.v1.products.$post({
                json,
            })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: (data) => {
            toast.success('Product created')
            router.push(`/store-dashboard/${data.storeId}/products`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create product')
        },
    })

    return mutation
}
