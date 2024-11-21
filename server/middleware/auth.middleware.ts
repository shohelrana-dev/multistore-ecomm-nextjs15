import { UserRoleEnum } from '@/db/schema'
import { Context, Next } from 'hono'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import jwt from 'jsonwebtoken'

export function authMiddleware(role?: UserRoleEnum) {
    return createMiddleware(async (c: Context, next: Next) => {
        const token = c.req.header('authorization')?.split(' ')[1]
        if (!token) {
            throw new HTTPException(401, { message: 'You are not authorized' })
        }

        try {
            jwt.verify(token, process.env['ACCESS_TOKEN_SECRET']!)
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new HTTPException(403, { message: 'Authorization token expired' })
            }
            throw new HTTPException(401, { message: 'Invalid authorization token' })
        }
        const user = c.get('user')
        if (role && user.role !== role) {
            throw new HTTPException(403, {
                message: 'Forbidden: You are not permitted to access this resource',
            })
        }
        return await next()
    })
}
