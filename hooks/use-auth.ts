import { auth } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'

const initialData = {
    user: null,
    accessToken: null,
    refreshToken: null,
}

export default function useAuth() {
    const {
        data = initialData,
        isPending,
        isSuccess,
    } = useQuery({
        queryKey: ['auth'],
        queryFn: async () => {
            return await auth()
        },
    })

    return { ...data, isPending, isSuccess }
}
