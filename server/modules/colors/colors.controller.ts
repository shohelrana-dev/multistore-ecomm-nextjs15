import { colorSchema } from '@/lib/zod'
import { authMiddleware } from '@/server/middleware/auth.middleware'
import * as colorsService from '@/services/colors.service'
import { getStoreByIdAndUserId } from '@/services/stores.service'
import { zValidator } from '@hono/zod-validator'
import { createFactory } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

const factory = createFactory()

export const createColor = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', colorSchema),
    async (c) => {
        const user = c.get('user')
        const { name, value } = c.req.valid('json')
        const storeId = parseInt(c.req.param('storeId'))

        const existStore = await getStoreByIdAndUserId({ storeId, userId: user.id })
        if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

        const color = await colorsService.createColor({ storeId, name, value })

        return c.json(color)
    }
)

export const updateColor = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', colorSchema),
    async (c) => {
        const user = c.get('user')
        const { name, value } = c.req.valid('json')
        const storeId = parseInt(c.req.param('storeId'))
        const colorId = parseInt(c.req.param('colorId'))

        const existStore = await getStoreByIdAndUserId({ storeId, userId: user.id })
        if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

        const existColor = await colorsService.getColorById(colorId)
        if (!existColor) throw new HTTPException(400, { message: "Color doesn't exist." })

        const color = await colorsService.updateColor(colorId, {
            name,
            value,
        })

        return c.json(color)
    }
)

export const deleteColor = factory.createHandlers(authMiddleware('admin'), async (c) => {
    const colorId = parseInt(c.req.param('colorId'))

    const existColor = await colorsService.getColorById(colorId)
    if (!existColor) throw new HTTPException(400, { message: "Color doesn't exist." })

    const color = await colorsService.deleteColor(colorId)

    return c.json(color)
})

export const getColors = factory.createHandlers(async (c) => {
    const storeId = parseInt(c.req.param('storeId'))

    const colors = await colorsService.getColorsByStoreId(storeId)

    return c.json(colors)
})

export const getSingleColor = factory.createHandlers(async (c) => {
    const colorId = parseInt(c.req.param('colorId'))

    const color = await colorsService.getColorById(colorId)

    if (!color) throw new HTTPException(404, { message: "Color doesn't exist." })

    return c.json(color)
})
