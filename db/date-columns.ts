import { timestamp } from 'drizzle-orm/pg-core'

export const dateColumns = {
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date().toISOString()),
}
