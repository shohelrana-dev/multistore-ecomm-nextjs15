import { db } from '@/db'
import { imagesTable, productsTable } from '@/db/schema'
import { ProductFromValues } from '@/lib/zod'
import { desc, eq } from 'drizzle-orm'

export async function getProducts() {
    return await db.query.productsTable.findMany({
        with: { images: true },
        orderBy: desc(productsTable.createdAt),
    })
}

export async function getProductsByStoreId(storeId: number) {
    const result = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.storeId, storeId))
        .orderBy(desc(productsTable.createdAt))

    return result
}

export async function getProductById(productId: number) {
    return await db.query.productsTable.findFirst({
        with: { images: true },
        where: eq(productsTable.id, productId),
    })
}

export async function createProduct({ images, ...values }: ProductFromValues & { storeId: number }) {
    const [createdProduct] = await db.insert(productsTable).values(values).returning()

    // insert images if exists
    if (images && images.length > 0) {
        const imageValues = images.map((image) => ({ productId: createdProduct.id, url: image.url }))
        await db.insert(imagesTable).values(imageValues)
    }

    return createdProduct
}

export async function updateProduct(productId: number, { images, ...values }: ProductFromValues) {
    const [updatedProduct] = await db
        .update(productsTable)
        .set(values)
        .where(eq(productsTable.id, productId))
        .returning()

    // delete old images if exists
    await db.delete(imagesTable).where(eq(imagesTable.productId, productId))

    // insert new images
    if (images && images.length > 0) {
        const imageValues = images.map((image) => ({ productId: updatedProduct.id, url: image.url }))
        await db.insert(imagesTable).values(imageValues)
    }

    return updatedProduct
}

export async function deleteProduct(productId: number) {
    const [deletedProduct] = await db
        .delete(productsTable)
        .where(eq(productsTable.id, productId))
        .returning()

    return deletedProduct
}
