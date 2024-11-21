import { getStoreById } from '@/services/stores.service'
import { unstable_cache as cache } from 'next/cache'

export const getStoreByIdCached = cache((storeId: number) => {
    console.log('executed: getStoreByIdCached')
    return getStoreById(storeId)
})
