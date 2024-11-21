import { db } from '@/db'
import { accountsTable, ProviderNameEnum } from '@/db/schema'
import { and, eq } from 'drizzle-orm'

type CreateAccountData = {
    userId: number
    providerName: ProviderNameEnum
    providerAccountId?: string
    passwordHash?: string
}

export async function getAccount(values: { userId: number; providerName: ProviderNameEnum }) {
    const [account] = await db
        .select()
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.userId, values.userId),
                eq(accountsTable.providerName, values.providerName)
            )
        )

    return account
}

export async function getAccountByProviderId(providerAccountId: string) {
    const [account] = await db
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.providerAccountId, providerAccountId))
    return account
}

export async function createAccount(values: CreateAccountData) {
    const [createdAccount] = await db
        .insert(accountsTable)
        .values({
            userId: values.userId,
            providerName: values.providerName,
            providerAccountId: values.providerAccountId,
            password: values.passwordHash,
        })
        .returning()

    return createdAccount
}

export async function updateAccountPassword(userId: number, passwordHash: string) {
    await db
        .update(accountsTable)
        .set({ password: passwordHash })
        .where(and(eq(accountsTable.userId, userId), eq(accountsTable.providerName, 'credential')))
}
