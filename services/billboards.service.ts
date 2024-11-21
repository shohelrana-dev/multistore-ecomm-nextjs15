import { db } from '@/db'
import { billboardsTable } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function getBillboardsByStoreId(storeId: number) {
    const billboards = await db
        .select()
        .from(billboardsTable)
        .where(eq(billboardsTable.storeId, storeId))
        .orderBy(desc(billboardsTable.createdAt))

    return billboards
}

export async function getBillboardById(billboardId: number) {
    const [billboard] = await db
        .select()
        .from(billboardsTable)
        .where(eq(billboardsTable.id, billboardId))

    return billboard
}

export async function createBillboard(values: { storeId: number; title: string; image: string }) {
    const [createdBillboard] = await db.insert(billboardsTable).values(values).returning()

    return createdBillboard
}

export async function updateBillboard(billboardId: number, values: { title: string; image: string }) {
    const [updatedBillboard] = await db
        .update(billboardsTable)
        .set(values)
        .where(eq(billboardsTable.id, billboardId))
        .returning()

    return updatedBillboard
}

export async function deleteBillboard(billboardId: number) {
    const [deletedBillboard] = await db
        .delete(billboardsTable)
        .where(eq(billboardsTable.id, billboardId))
        .returning()

    return deletedBillboard
}
