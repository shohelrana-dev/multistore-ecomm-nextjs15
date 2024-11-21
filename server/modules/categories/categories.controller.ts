import { categorySchema } from '@/lib/zod'
import { authMiddleware } from '@/server/middleware/auth.middleware'
import { getBillboardById } from '@/services/billboards.service'
import * as categoriesService from '@/services/categories.service'
import { getStoreByIdAndUserId } from '@/services/stores.service'
import { zValidator } from '@hono/zod-validator'
import { createFactory } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

const factory = createFactory()

export const createCategory = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', categorySchema),
    async (c) => {
        const user = c.get('user')
        const { name, billboardId } = c.req.valid('json')
        const storeId = parseInt(c.req.param('storeId'))

        const existStore = await getStoreByIdAndUserId({ storeId, userId: user.id })
        if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

        const existBillboard = await getBillboardById(parseInt(billboardId))
        if (!existBillboard) throw new HTTPException(400, { message: "Billboard doesn't exist." })

        const category = await categoriesService.createCategory({
            storeId,
            billboardId: parseInt(billboardId),
            name,
        })

        return c.json(category)
    }
)

export const updateCategory = factory.createHandlers(
    authMiddleware('admin'),
    zValidator('json', categorySchema),
    async (c) => {
        const user = c.get('user')
        const { name } = c.req.valid('json')
        const storeId = parseInt(c.req.param('storeId'))
        const categoryId = parseInt(c.req.param('categoryId'))

        const existStore = await getStoreByIdAndUserId({ storeId, userId: user.id })
        if (!existStore) throw new HTTPException(400, { message: "Store doesn't exist." })

        const existCategory = await categoriesService.getCategoryById(categoryId)
        if (!existCategory) throw new HTTPException(400, { message: "Category doesn't exist." })

        const updatedCategory = await categoriesService.updateCategory(categoryId, {
            name,
        })

        return c.json(updatedCategory)
    }
)

export const deleteCategory = factory.createHandlers(authMiddleware('admin'), async (c) => {
    const categoryId = parseInt(c.req.param('categoryId'))

    const existCategory = await categoriesService.getCategoryById(categoryId)
    if (!existCategory) throw new HTTPException(400, { message: "Category doesn't exist." })

    const deletedCategory = await categoriesService.deleteCategory(categoryId)

    return c.json(deletedCategory)
})

export const getCategories = factory.createHandlers(async (c) => {
    const storeId = parseInt(c.req.param('storeId'))

    const categories = await categoriesService.getCategoriesByStoreId(storeId)

    return c.json(categories)
})

export const getSingleCategory = factory.createHandlers(async (c) => {
    const categoryId = parseInt(c.req.param('categoryId'))

    const category = await categoriesService.getCategoryById(categoryId)

    if (!category) throw new HTTPException(404, { message: "Category doesn't exist." })

    return c.json(category)
})
