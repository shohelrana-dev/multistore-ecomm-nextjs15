import { integer, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'
import { usersTable } from './users.table'

export const providerNameEnum = pgEnum('provider_name', ['credential', 'google', 'facebook'])
export type ProviderNameEnum = 'credential' | 'google' | 'facebook'

export const accountsTable = pgTable('accounts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    providerName: providerNameEnum('provider_name').notNull(),
    providerAccountId: text('provider_account_id'),
    refreshToken: text('refresh_token'),
    password: text('password'),
    ...dateColumns,
})

export type Account = typeof accountsTable.$inferSelect
