import { zValidator } from '@hono/zod-validator'
import { createFactory } from 'hono/factory'

import { storeSchema } from '@/lib/zod'
import { authMiddleware } from '@/server/middleware/auth.middleware'
import * as storesService from '@/services/stores.service'
import { HTTPException } from 'hono/http-exception'

const factory = createFactory()

export const createStore = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', storeSchema),
    async (c) => {
        const user = c.get('user')
        const { name, location } = c.req.valid('json')

        const store = await storesService.createStore({ userId: user.id, name, location })

        return c.json(store)
    }
)

export const updateStore = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', storeSchema),
    async (c) => {
        const { name, location } = c.req.valid('json')
        const storeId = parseInt(c.req.param('storeId'))

        const store = await storesService.updateStore(storeId, { name, location })

        return c.json(store)
    }
)

export const deleteStore = factory.createHandlers(authMiddleware('admin'), async (c) => {
    const user = c.get('user')
    const storeId = parseInt(c.req.param('storeId'))

    const existStore = await storesService.getStoreByIdAndUserId({ storeId, userId: user.id })
    if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

    const store = await storesService.deleteStore(storeId)

    return c.json(store)
})

export const getSingleStore = factory.createHandlers(async (c) => {
    const storeId = parseInt(c.req.param('storeId'))

    const store = await storesService.getStoreById(storeId)
    if (!store) throw new HTTPException(404, { message: "Store doesn't exist." })

    return c.json(store)
})

export const getStores = factory.createHandlers(async (c) => {
    const stores = await storesService.getStores()

    return c.json(stores)
})
