import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'
import { storesTable } from '../schema'

export const colorsTable = pgTable('colors', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id')
        .references(() => storesTable.id, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
    value: text('value').notNull(),
    ...dateColumns,
})

export type Color = typeof colorsTable.$inferSelect
