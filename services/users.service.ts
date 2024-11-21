import { db } from '@/db'
import { usersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import 'server-only'

type CreateUserData = {
    name: string
    email: string
    avatar?: string
    emailVerifiedAt?: string | null
}

export async function getUserById(userId: number) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId))
    return user
}

export async function getUserByEmail(email: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))
    return user
}

export async function createUser(data: CreateUserData) {
    const [user] = await db
        .insert(usersTable)
        .values({
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            emailVerifiedAt: data.emailVerifiedAt,
        })
        .returning()

    return user
}

export async function updateUser(
    userId: number,
    values: {
        name?: string
        picture?: string
        emailVerifiedAt?: string
    }
) {
    const [user] = await db
        .update(usersTable)
        .set({ ...values })
        .where(eq(usersTable.id, userId))
        .returning()

    return user
}
