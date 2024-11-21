import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'
import { productsTable } from './products.table'

export const imagesTable = pgTable('images', {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
        .references(() => productsTable.id, { onDelete: 'cascade' })
        .notNull(),
    url: text('url').notNull(),
    ...dateColumns,
})

export const imagesRelations = relations(imagesTable, ({ one }) => ({
    product: one(productsTable, {
        fields: [imagesTable.productId],
        references: [productsTable.id],
    }),
}))

export type Image = typeof imagesTable.$inferSelect
