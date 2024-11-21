import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'
import { imagesTable } from './images.table'
import { storesTable } from './stores.table'

export const variationsTable = pgTable('variations', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id')
        .references(() => storesTable.id, { onDelete: 'cascade' })
        .notNull(),
    productId: integer('product_id')
        .references(() => imagesTable.productId)
        .notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    ...dateColumns,
})

export const variationsRelations = relations(variationsTable, ({ many, one }) => ({
    store: one(storesTable, {
        fields: [variationsTable.storeId],
        references: [storesTable.id],
    }),
    products: many(imagesTable),
}))

export type Variation = typeof variationsTable.$inferSelect
