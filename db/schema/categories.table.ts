import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'
import { metaTable } from './meta.table'
import { productsTable } from './products.table'
import { storesTable } from './stores.table'

export const categoriesTable = pgTable('categories', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id')
        .references(() => storesTable.id, { onDelete: 'cascade' })
        .notNull(),
    parentId: integer('parent_id'),
    name: varchar('name', { length: 100 }).notNull(),
    thumbnail: varchar('thumbnail').notNull(),
    slug: varchar('slug', { length: 120 }).notNull(),
    featured: boolean('featured').default(false),
    ...dateColumns,
})

export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({
    store: one(storesTable, {
        fields: [categoriesTable.storeId],
        references: [storesTable.id],
    }),
    products: many(productsTable),
    meta: one(metaTable, {
        fields: [categoriesTable.id],
        references: [metaTable.sourceId],
    }),
}))

export type Category = typeof categoriesTable.$inferSelect
