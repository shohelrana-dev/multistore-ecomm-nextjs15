import argon2 from '@node-rs/argon2'

export const hashOptions = {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
}

export async function hashPassword(password: string) {
    return await argon2.hash(password, hashOptions)
}

export async function verifyPassword(hashedPassword: string, password: string) {
    return await argon2.verify(hashedPassword, password, hashOptions)
}
