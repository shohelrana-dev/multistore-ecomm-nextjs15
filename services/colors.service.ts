import { db } from '@/db'
import { colorsTable } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function getColorsByStoreId(storeId: number) {
    const colors = await db
        .select()
        .from(colorsTable)
        .where(eq(colorsTable.storeId, storeId))
        .orderBy(desc(colorsTable.createdAt))

    return colors
}

export async function getColorById(colorId: number) {
    const [color] = await db.select().from(colorsTable).where(eq(colorsTable.id, colorId))

    return color
}

export async function createColor(values: { storeId: number; name: string; value: string }) {
    const [createdColor] = await db.insert(colorsTable).values(values).returning()

    return createdColor
}

export async function updateColor(colorId: number, values: { name: string; value: string }) {
    const [updatedColor] = await db
        .update(colorsTable)
        .set(values)
        .where(eq(colorsTable.id, colorId))
        .returning()

    return updatedColor
}

export async function deleteColor(colorId: number) {
    const [deletedColor] = await db.delete(colorsTable).where(eq(colorsTable.id, colorId)).returning()

    return deletedColor
}
