import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function errorHandler(err: Error, c: Context) {
    console.error(err)

    if (err instanceof HTTPException) {
        return c.json({ status: 'error', code: err.status, message: err.message }, err.status)
    }
    return c.json({ status: 'error', code: 500, message: 'Internal server error' }, 500)
}
