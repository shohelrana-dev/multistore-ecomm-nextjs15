import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<(typeof client.api.v1.products)[':productId']['$patch']>
type ResposeType = InferResponseType<(typeof client.api.v1.products)[':productId']['$patch']>

export function useUpdateProduct() {
    const router = useRouter()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['products'],
        mutationFn: async ({ json, param }) => {
            const response = await client.api.v1.products[':productId'].$patch({
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
            toast.success('Product updated')
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update product')
        },
    })

    return mutation
}
