import { db } from '@/db'
import { accountsTable, User } from '@/db/schema'
import { eq, or } from 'drizzle-orm'
import jwt, { JwtPayload } from 'jsonwebtoken'

const accessTokenSecret = process.env['ACCESS_TOKEN_SECRET']
const refreshTokenSecret = process.env['REFRESH_TOKEN_SECRET']
export const accessTokenExpiresIn = process.env['ACCESS_TOKEN_EXPIRES_IN'] || '15m'
export const refreshTokenExpiresIn = process.env['REFRESH_TOKEN_EXPIRES_IN'] || '3d'

// Generate access token
export function generateAccessToken(user: User) {
    return jwt.sign({ user: { id: user.id, email: user.email, role: user.role } }, accessTokenSecret!, {
        expiresIn: accessTokenExpiresIn,
    })
}

// Generate refresh token
export function generateRefreshToken(user: User) {
    return jwt.sign({ user: { id: user.id, email: user.email, role: user.role } }, refreshTokenSecret!, {
        expiresIn: refreshTokenExpiresIn,
    })
}

//verify access token
export function verifyAccessToken(token: string) {
    try {
        return jwt.verify(token, accessTokenSecret!) as JwtPayload
    } catch {
        return null
    }
}

//verify refresh token
export async function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, refreshTokenSecret!) as JwtPayload
    } catch {
        return null
    }
}

export function decodeToken(token: string) {
    return jwt.decode(token) as JwtPayload
}

export async function storeRefreshToken(values: { refreshToken: string; userId: number }) {
    const { refreshToken, userId } = values
    const [account] = await db
        .update(accountsTable)
        .set({ refreshToken })
        .where(eq(accountsTable.userId, userId))
        .returning()

    return account.refreshToken
}

export async function getStoredRefreshToken(token: string) {
    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.refreshToken, token))

    return account?.refreshToken
}

export async function deleteStoredRefreshToken(values: { refreshToken?: string; userId?: string }) {
    const [account] = await db
        .update(accountsTable)
        .set({ refreshToken: null })
        .where(
            or(
                //@ts-ignore
                eq(accountsTable.userId, values.userId),
                //@ts-ignore
                eq(accountsTable.refreshToken, values.refreshToken)
            )
        )
        .returning()

    return account.refreshToken
}
