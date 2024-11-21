import { useMutation } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/hono-client'
import { ErrorResponse } from '@/lib/types'

type RequestType = InferRequestType<typeof client.api.v1.stores.$post>
type ResposeType = InferResponseType<typeof client.api.v1.stores.$post>

export function useCreateStore() {
    const router = useRouter()
    const mutation = useMutation<ResposeType, ErrorResponse, RequestType>({
        mutationKey: ['stores'],
        mutationFn: async ({ json }) => {
            const response = await client.api.v1.stores.$post({ json })
            const data = await response.json()

            if (response.ok) {
                return data
            }
            throw data
        },
        onSuccess: (data) => {
            toast.success('Store created')
            //window.location.assign(`/store-dashboard/${data.id}`)
            router.push(`/store-dashboard/${data.id}`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create store')
        },
    })

    return mutation
}
