import { billboardSchema } from '@/lib/zod'
import { authMiddleware } from '@/server/middleware/auth.middleware'
import * as billboardsService from '@/services/billboards.service'
import { getStoreByIdAndUserId } from '@/services/stores.service'
import { zValidator } from '@hono/zod-validator'
import { createFactory } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

const factory = createFactory()

export const createBillboard = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', billboardSchema),
    async (c) => {
        const user = c.get('user')
        const { title, image } = c.req.valid('json')
        const storeId = parseInt(c.req.param('storeId'))

        const existStore = await getStoreByIdAndUserId({ storeId, userId: user.id })
        if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

        const billboard = await billboardsService.createBillboard({ title, image, storeId })

        return c.json(billboard)
    }
)

export const updateBillboard = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', billboardSchema),
    async (c) => {
        const user = c.get('user')
        const { title, image } = c.req.valid('json')
        const storeId = parseInt(c.req.param('storeId'))
        const billboardId = parseInt(c.req.param('billboardId'))

        const existStore = await getStoreByIdAndUserId({ storeId, userId: user.id })
        if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

        const existBillboard = await billboardsService.getBillboardById(billboardId)
        if (!existBillboard) throw new HTTPException(400, { message: "Billboard doesn't exist." })

        const billboard = await billboardsService.updateBillboard(billboardId, {
            image,
            title,
        })

        return c.json(billboard)
    }
)

export const deleteBillboard = factory.createHandlers(authMiddleware('admin'), async (c) => {
    const billboardId = parseInt(c.req.param('billboardId'))

    const existBillboard = await billboardsService.getBillboardById(billboardId)
    if (!existBillboard) throw new HTTPException(400, { message: "Billboard doesn't exist." })

    const billboard = await billboardsService.deleteBillboard(billboardId)

    return c.json(billboard)
})

export const getBillboards = factory.createHandlers(async (c) => {
    const storeId = parseInt(c.req.param('storeId'))

    const billboards = await billboardsService.getBillboardsByStoreId(storeId)

    return c.json(billboards)
})

export const getSingleBillboard = factory.createHandlers(async (c) => {
    const billboardId = parseInt(c.req.param('billboardId'))

    const billboard = await billboardsService.getBillboardById(billboardId)

    if (!billboard) throw new HTTPException(404, { message: "Billboard doesn't exist." })

    return c.json(billboard)
})
