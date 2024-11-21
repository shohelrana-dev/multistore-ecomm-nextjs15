import { zValidator } from '@hono/zod-validator'
import { createFactory } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

import VerifyEmail from '@/emails/verify-email'
import { emailValidation, emailVerificationSchema, loginSchema, signupSchema } from '@/lib/zod'
import { authMiddleware } from '@/server/middleware/auth.middleware'
import { sendEmail } from '@/server/utils/mail'
import { hashPassword, verifyPassword } from '@/server/utils/password'
import {
    accessTokenExpiresIn,
    deleteStoredRefreshToken,
    generateAccessToken,
    generateRefreshToken,
    getStoredRefreshToken,
    refreshTokenExpiresIn,
    storeRefreshToken,
    verifyRefreshToken,
} from '@/server/utils/token'
import { TokenResponseData } from '@/server/utils/types'
import { createAccount, getAccount, getAccountByProviderId } from '@/services/accounts.service'
import * as usersService from '@/services/users.service'
import { generateVerficationToken, getVerificationToken } from '@/services/verifications.service'

const factory = createFactory()
const oneTimeCodes = {} as { [key: string]: TokenResponseData }

export const signup = factory.createHandlers(zValidator('json', signupSchema), async (c) => {
    const { name, email, password } = c.req.valid('json')

    if (!name || !email || !password) {
        throw new HTTPException(422, { message: 'name, email and password are required' })
    }

    // Fetch user from the database
    let user = await usersService.getUserByEmail(email)

    if (!user) {
        // Create new user
        user = await usersService.createUser({ name, email })
    }

    //fetch account from the database
    const account = await getAccount({ userId: user.id, providerName: 'credential' })
    if (account) throw new HTTPException(400, { message: 'Account already exists with this email' })

    // create account
    await createAccount({
        userId: user.id,
        providerName: 'credential',
        passwordHash: await hashPassword(password),
    })

    return c.json(user)
})

export const login = factory.createHandlers(zValidator('json', loginSchema), async (c) => {
    const { email, password } = c.req.valid('json')

    if (!email || !password) {
        throw new HTTPException(422, { message: 'email and password are required' })
    }

    // Fetch user from the database
    const user = await usersService.getUserByEmail(email)
    if (!user) throw new HTTPException(400, { message: 'User not found with this email' })

    //fetch account from the database
    const account = await getAccount({ userId: user.id, providerName: 'credential' })
    if (!account) throw new HTTPException(400, { message: 'Account not found with this email' })

    // Verify password
    const isPasswordValid = await verifyPassword(account.password!, password)
    if (!isPasswordValid) throw new HTTPException(400, { message: 'Invalid credentials' })

    if (!user.emailVerifiedAt) throw new HTTPException(403, { message: 'Please verify your email' })

    // Generate tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Store refreshToken securely in the database
    await storeRefreshToken({
        userId: user.id,
        refreshToken,
    })

    return c.json({
        user,
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
    })
})

export const loginWithGoogle = factory.createHandlers(async (c) => {
    const requestId = c.get('requestId')
    const googleUser = c.get('user-google')
    const callbackUrl = decodeURIComponent(c.req.query('state') || '')

    if (!googleUser) {
        throw new HTTPException(400, { message: 'Google user account not found' })
    }

    if (!callbackUrl || !callbackUrl.startsWith('http')) {
        throw new HTTPException(400, { message: 'Callback url not found provided' })
    }

    let user = await usersService.getUserByEmail(googleUser.email!)
    if (!user) {
        // Create new user
        user = await usersService.createUser({
            name: googleUser.name!,
            email: googleUser.email!,
            avatar: googleUser.picture!,
            emailVerifiedAt: new Date().toISOString(),
        })
    }

    let account = await getAccountByProviderId(googleUser.id!)
    if (!account) {
        // Create new account
        account = await createAccount({
            userId: user.id,
            providerName: 'google',
            providerAccountId: googleUser.id!,
        })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Store refreshToken securely in the database
    await storeRefreshToken({
        userId: user.id,
        refreshToken,
    })

    //temporary store token in memory
    oneTimeCodes[requestId] = {
        user: user,
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
    }

    //invalidate after 2 minutes
    setTimeout(() => {
        delete oneTimeCodes[requestId]
    }, 120000)

    return c.redirect(callbackUrl + `?code=${requestId}`)
})

export const exchangeCode = factory.createHandlers(
    zValidator('json', z.object({ code: z.string().min(1) })),
    async (c) => {
        const { code } = c.req.valid('json')

        if (!code) {
            throw new HTTPException(422, { message: 'Code is required' })
        }

        const tokenData = oneTimeCodes[code]

        if (!tokenData) {
            throw new HTTPException(400, { message: 'Invalid code or code has expired' })
        }

        return c.json(tokenData)
    }
)

export const refreshAccessToken = factory.createHandlers(async (c) => {
    const refreshToken = c.req.header('authorization')?.split(' ')[1]
    if (!refreshToken) {
        throw new HTTPException(400, { message: 'Token is not provided in header' })
    }

    const storedRefreshToken = await getStoredRefreshToken(refreshToken)
    if (!storedRefreshToken) {
        throw new HTTPException(401, { message: "Refresh token did't match" })
    }

    //matching refresh token with database stored token
    if (storedRefreshToken !== refreshToken) {
        throw new HTTPException(401, { message: "Refresh token did't match" })
    }

    //verify refresh token
    const decodedRefreshToken = await verifyRefreshToken(refreshToken)
    if (!decodedRefreshToken) {
        //delete stored refresh token
        await deleteStoredRefreshToken({ refreshToken })
        //throw error
        throw new HTTPException(401, { message: 'Invalid refresh token' })
    }

    const user = await usersService.getUserByEmail(decodedRefreshToken.user.email)
    if (!user) throw new HTTPException(401, { message: 'User not found' })

    const accessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)

    //save new refresh token in database
    await storeRefreshToken({
        userId: user.id,
        refreshToken: newRefreshToken,
    })

    return c.json({
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
    })
})

export const getAuthUser = factory.createHandlers(authMiddleware(), async (c) => {
    const user = c.get('user')
    const findUser = await usersService.getUserByEmail(user.email)

    return c.json(findUser)
})

export const logout = factory.createHandlers(authMiddleware(), async (c) => {
    const user = c.get('user')

    // Delete refreshToken from the database
    await deleteStoredRefreshToken({
        userId: user.id,
    })

    return c.json({ messge: 'Logged out' })
})

export const verifyEmail = factory.createHandlers(
    zValidator('json', emailVerificationSchema),
    async (c) => {
        const { code, email } = c.req.valid('json')

        if (!code || !email) throw new HTTPException(400, { message: 'email and code is required' })

        const user = await usersService.getUserByEmail(email)
        if (!user) throw new HTTPException(400, { message: 'User not found with this email' })

        if (user.emailVerifiedAt) throw new HTTPException(400, { message: 'Email already verified' })

        const verification = await getVerificationToken(code, 'email_verification')
        if (!verification) throw new HTTPException(400, { message: 'Verification code not found' })

        if (verification.expiresAt.getTime() < Date.now()) {
            throw new HTTPException(400, { message: 'Verification code expired' })
        }

        const updatedUser = await usersService.updateUser(user.id, {
            emailVerifiedAt: new Date().toISOString(),
        })

        return c.json(updatedUser)
    }
)

export const resendVerificationEmail = factory.createHandlers(
    zValidator('json', z.object({ email: emailValidation })),
    async (c) => {
        const { email } = c.req.valid('json')

        if (!email) throw new HTTPException(400, { message: 'Email is required' })

        const user = await usersService.getUserByEmail(email)
        if (!user) throw new HTTPException(400, { message: 'User not found with this email' })

        if (user.emailVerifiedAt) throw new HTTPException(400, { message: 'Email already verified' })

        const token = await generateVerficationToken(user.id, 'email_verification')

        await sendEmail({
            to: email,
            subject: `Email Verification Code ${token}`,
            react: VerifyEmail({ name: user.name, verificationCode: token }),
        })

        return c.json({ message: 'Verification email sent successfully' })
    }
)
