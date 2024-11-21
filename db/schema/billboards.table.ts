import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'
import { storesTable } from '../schema'

export const billboardsTable = pgTable('billboards', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id')
        .references(() => storesTable.id, { onDelete: 'cascade' })
        .notNull(),
    title: text('title').notNull(),
    image: text('image').notNull(),
    ...dateColumns,
})

export type Billboard = typeof billboardsTable.$inferSelect
