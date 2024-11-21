import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'
import { storesTable } from './stores.table'
import { variationsTable } from './variations.table'

export const variationsOptionsTable = pgTable('variations_options', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id')
        .references(() => storesTable.id, { onDelete: 'cascade' })
        .notNull(),
    variationId: integer('variation_id')
        .references(() => variationsTable.id)
        .notNull(),
    name: varchar('name').notNull(),
    smallImage: varchar('small_image', { length: 200 }),
    sku: varchar('sku', { length: 100 }).notNull(),
    price: integer('price').notNull(),
    discountPrice: integer('discount_price'),
    stock: integer('stock').default(0),
    ...dateColumns,
})

export const variationsOptionsRelations = relations(variationsOptionsTable, ({ one }) => ({
    store: one(storesTable, {
        fields: [variationsOptionsTable.storeId],
        references: [storesTable.id],
    }),
    variation: one(variationsTable, {
        fields: [variationsOptionsTable.variationId],
        references: [variationsTable.id],
    }),
}))

export type Variation = typeof variationsOptionsTable.$inferSelect
