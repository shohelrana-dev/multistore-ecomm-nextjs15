import { sizeSchema } from '@/lib/zod'
import { authMiddleware } from '@/server/middleware/auth.middleware'
import * as sizesService from '@/services/sizes.service'
import { getStoreByIdAndUserId } from '@/services/stores.service'
import { zValidator } from '@hono/zod-validator'
import { createFactory } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

const factory = createFactory()

export const createSize = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', sizeSchema),
    async (c) => {
        const user = c.get('user')
        const { name, value } = c.req.valid('json')
        const storeId = parseInt(c.req.param('storeId'))

        const existStore = await getStoreByIdAndUserId({ storeId, userId: user.id })
        if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

        const size = await sizesService.createSize({ storeId, name, value })

        return c.json(size)
    }
)

export const updateSize = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', sizeSchema),
    async (c) => {
        const user = c.get('user')
        const { name, value } = c.req.valid('json')
        const storeId = parseInt(c.req.param('storeId'))
        const sizeId = parseInt(c.req.param('sizeId'))

        const existStore = await getStoreByIdAndUserId({ storeId, userId: user.id })
        if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

        const existSize = await sizesService.getSizeById(sizeId)
        if (!existSize) throw new HTTPException(400, { message: "Size doesn't exist." })

        const size = await sizesService.updateSize(sizeId, {
            name,
            value,
        })

        return c.json(size)
    }
)

export const deleteSize = factory.createHandlers(authMiddleware('admin'), async (c) => {
    const sizeId = parseInt(c.req.param('sizeId'))

    const existSize = await sizesService.getSizeById(sizeId)
    if (!existSize) throw new HTTPException(400, { message: "Size doesn't exist." })

    const size = await sizesService.deleteSize(sizeId)

    return c.json(size)
})

export const getSizes = factory.createHandlers(async (c) => {
    const storeId = parseInt(c.req.param('storeId'))

    const sizes = await sizesService.getSizesByStoreId(storeId)

    return c.json(sizes)
})

export const getSingleSize = factory.createHandlers(async (c) => {
    const sizeId = parseInt(c.req.param('sizeId'))

    const size = await sizesService.getSizeById(sizeId)

    if (!size) throw new HTTPException(404, { message: "Size doesn't exist." })

    return c.json(size)
})
