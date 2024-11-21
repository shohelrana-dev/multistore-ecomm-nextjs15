import { Context, Next } from 'hono'
import { createMiddleware } from 'hono/factory'
import { decodeToken } from '../utils/token'

export const serializeUserMiddleware = createMiddleware(async (c: Context, next: Next) => {
    const token = c.req.header('authorization')?.split(' ')[1]

    if (!token) {
        console.log('Authorization token not provided')
        return await next()
    }

    const decoded = decodeToken(token)
    if (!decoded) {
        console.log('Authorization token is invalid')
        return await next()
    }

    c.set('user', decoded.user)
    return await next()
})
