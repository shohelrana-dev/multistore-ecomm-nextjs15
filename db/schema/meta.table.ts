import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'

export const metaTable = pgTable('meta', {
    id: serial('id').primaryKey(),
    sourceId: integer('source_id').notNull(),
    title: varchar('title').notNull(),
    description: text('description').notNull(),
    keywords: text('keywords').notNull(),
    ...dateColumns,
})

export type Meta = typeof metaTable.$inferSelect
