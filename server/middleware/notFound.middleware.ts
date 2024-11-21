import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

export const notFoundMiddleware = createMiddleware(() => {
    throw new HTTPException(404, { message: 'The route is not available' })
})
