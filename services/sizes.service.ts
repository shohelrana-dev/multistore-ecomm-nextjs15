import { db } from '@/db'
import { sizesTable } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function getSizesByStoreId(storeId: number) {
    const sizes = await db
        .select()
        .from(sizesTable)
        .where(eq(sizesTable.storeId, storeId))
        .orderBy(desc(sizesTable.createdAt))

    return sizes
}

export async function getSizeById(sizeId: number) {
    const [size] = await db.select().from(sizesTable).where(eq(sizesTable.id, sizeId))

    return size
}

export async function createSize(values: { storeId: number; name: string; value: string }) {
    const [createdSize] = await db.insert(sizesTable).values(values).returning()

    return createdSize
}

export async function updateSize(sizeId: number, values: { name: string; value: string }) {
    const [updatedSize] = await db
        .update(sizesTable)
        .set(values)
        .where(eq(sizesTable.id, sizeId))
        .returning()

    return updatedSize
}

export async function deleteSize(sizeId: number) {
    const [deletedSize] = await db.delete(sizesTable).where(eq(sizesTable.id, sizeId)).returning()

    return deletedSize
}
