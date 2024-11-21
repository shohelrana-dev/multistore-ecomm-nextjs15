import { db } from '@/db'
import { verificationsTable, VerificationTypeEnum } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import otpGenerator from 'otp-generator'
import 'server-only'

export async function generateVerficationToken(
    userId: number,
    verificationType: VerificationTypeEnum,
    digitsOnly = true
) {
    //delete existing token if exists
    await db.delete(verificationsTable).where(and(eq(verificationsTable.userId, userId)))

    const otp = otpGenerator.generate(digitsOnly ? 6 : 12, {
        digits: digitsOnly,
        upperCaseAlphabets: !digitsOnly,
        lowerCaseAlphabets: !digitsOnly,
        specialChars: !digitsOnly,
    })
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10)

    const [existingToken] = await db
        .select()
        .from(verificationsTable)
        .where(eq(verificationsTable.userId, userId))

    if (existingToken) {
        const [updatedToken] = await db
            .update(verificationsTable)
            .set({ value: otp, expiresAt })
            .where(eq(verificationsTable.id, existingToken.id))
            .returning()

        return updatedToken.value
    }

    const [verification] = await db
        .insert(verificationsTable)
        .values({
            userId: userId,
            verificationType,
            value: otp,
            expiresAt,
        })
        .returning()

    return verification.value
}

export async function getVerificationToken(token: string, verificationType: VerificationTypeEnum) {
    const [verification] = await db
        .select()
        .from(verificationsTable)
        .where(
            and(
                eq(verificationsTable.value, token),
                eq(verificationsTable.verificationType, verificationType)
            )
        )

    return verification
}

export async function deleteVerificationToken(token: string) {
    return await db.delete(verificationsTable).where(eq(verificationsTable.value, token))
}
