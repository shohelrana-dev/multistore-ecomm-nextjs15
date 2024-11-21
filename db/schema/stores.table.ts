import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'
import { usersTable } from './users.table'

export const storesTable = pgTable('stores', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
    location: text('location').notNull(),
    ...dateColumns,
})

export type Store = typeof storesTable.$inferSelect
