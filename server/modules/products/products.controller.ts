import { productSchema } from '@/lib/zod'
import { authMiddleware } from '@/server/middleware/auth.middleware'
import * as productsService from '@/services/products.service'
import { getStoreByIdAndUserId } from '@/services/stores.service'
import { zValidator } from '@hono/zod-validator'
import { createFactory } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

const factory = createFactory()

export const createProduct = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', productSchema),
    async (c) => {
        const user = c.get('user')
        const values = c.req.valid('json')

        const existStore = await getStoreByIdAndUserId({ storeId: values.storeId, userId: user.id })
        if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

        const product = await productsService.createProduct(values)

        return c.json(product)
    }
)

export const updateProduct = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', productSchema),
    async (c) => {
        const user = c.get('user')
        const values = c.req.valid('json')
        const productId = parseInt(c.req.param('productId'))

        const existStore = await getStoreByIdAndUserId({ storeId: values.storeId, userId: user.id })
        if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

        const existProduct = await productsService.getProductById(productId)
        if (!existProduct) throw new HTTPException(400, { message: "Product doesn't exist." })

        const updatedProduct = await productsService.updateProduct(productId, values)

        return c.json(updatedProduct)
    }
)

export const deleteProduct = factory.createHandlers(authMiddleware('admin'), async (c) => {
    const productId = parseInt(c.req.param('productId'))

    const existProduct = await productsService.getProductById(productId)
    if (!existProduct) throw new HTTPException(400, { message: "Product doesn't exist." })

    const product = await productsService.deleteProduct(productId)

    return c.json(product)
})

export const getProducts = factory.createHandlers(async (c) => {
    const storeId = parseInt(c.req.query('storeId')!)

    if (storeId) {
        return c.json(await productsService.getProductsByStoreId(storeId))
    }

    return c.json(await productsService.getProducts())
})

export const getSingleProduct = factory.createHandlers(async (c) => {
    const productId = parseInt(c.req.param('productId'))

    const product = await productsService.getProductById(productId)

    if (!product) throw new HTTPException(404, { message: "Product doesn't exist." })

    return c.json(product)
})
