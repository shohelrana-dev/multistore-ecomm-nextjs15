import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { dateColumns } from '../date-columns'
import { usersTable } from './users.table'

export const verificationTypeEnum = pgEnum('verification_type', [
    'email_verification',
    'password_reset',
    'magic_link',
])
export type VerificationTypeEnum = 'email_verification' | 'password_reset' | 'magic_link'

export const verificationsTable = pgTable('verifications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    verificationType: verificationTypeEnum('verification_type').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    ...dateColumns,
})

export type Verification = typeof verificationsTable.$inferSelect
