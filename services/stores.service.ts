import { db } from '@/db'
import { storesTable } from '@/db/schema'
import { and, desc, eq } from 'drizzle-orm'

export async function createStore(values: { userId: number; name: string; location: string }) {
    const [createdStore] = await db.insert(storesTable).values(values).returning()
    return createdStore
}

export async function getStores() {
    return await db.select().from(storesTable).orderBy(desc(storesTable.createdAt))
}

export async function getUserStores(userId: number) {
    return await db
        .select()
        .from(storesTable)
        .where(eq(storesTable.userId, userId))
        .orderBy(desc(storesTable.createdAt))
}

export async function getStoreById(storeId: number) {
    const [store] = await db.select().from(storesTable).where(eq(storesTable.id, storeId))

    return store
}

export async function getStoreByIdAndUserId(values: { storeId: number; userId: number }) {
    const [store] = await db
        .select()
        .from(storesTable)
        .where(and(eq(storesTable.id, values.storeId), eq(storesTable.userId, values.userId)))

    return store
}

export async function getLastStoreByUserId(userId: number) {
    const [store] = await db
        .select()
        .from(storesTable)
        .where(eq(storesTable.userId, userId))
        .orderBy(desc(storesTable.createdAt))
        .limit(1)

    return store
}

export async function updateStore(storeId: number, values: { name: string; location: string }) {
    const [updatedStore] = await db
        .update(storesTable)
        .set(values)
        .where(eq(storesTable.id, storeId))
        .returning()

    return updatedStore
}

export async function deleteStore(storeId: number) {
    const [deletedStore] = await db.delete(storesTable).where(eq(storesTable.id, storeId)).returning()

    return deletedStore
}
