import { pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'

export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'super_admin'])
export type UserRoleEnum = 'user' | 'admin' | 'super_admin'

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    avatar: text('avatar'),
    email: text('email').unique().notNull(),
    emailVerifiedAt: timestamp('email_verified_at', { mode: 'string' }),
    role: userRoleEnum('role').default('user').notNull(),
    ...dateColumns,
})

export type User = typeof usersTable.$inferSelect
