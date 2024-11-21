import { db } from '@/db'
import { billboardsTable, categoriesTable } from '@/db/schema'
import { desc, eq, getTableColumns } from 'drizzle-orm'

export async function getCategoriesByStoreId(storeId: number) {
    const categories = await db
        .select({
            ...getTableColumns(categoriesTable),
            billboard: billboardsTable,
        })
        .from(categoriesTable)
        .where(eq(categoriesTable.storeId, storeId))
        .leftJoin(billboardsTable, eq(categoriesTable.billboardId, billboardsTable.id))
        .orderBy(desc(categoriesTable.createdAt))

    return categories
}

export async function getCategoryById(categoryId: number) {
    const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, categoryId))

    return category
}

export async function createCategory(values: { storeId: number; billboardId: number; name: string }) {
    const [createdCategory] = await db.insert(categoriesTable).values(values).returning()

    return createdCategory
}

export async function updateCategory(categoryId: number, values: { name: string }) {
    const [updatedCategory] = await db
        .update(categoriesTable)
        .set(values)
        .where(eq(categoriesTable.id, categoryId))
        .returning()

    return updatedCategory
}

export async function deleteCategory(categoryId: number) {
    const [deletedCategory] = await db
        .delete(categoriesTable)
        .where(eq(categoriesTable.id, categoryId))
        .returning()

    return deletedCategory
}
