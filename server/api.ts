import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { requestId } from 'hono/request-id'

import { notFoundMiddleware } from './middleware/notFound.middleware'
import { serializeUserMiddleware } from './middleware/serilalize-user.middleware'
import authRoute from './modules/auth/auth.route'
import billboardsRoute from './modules/billboards/billboards.route'
import categoriesRoute from './modules/categories/categories.route'
import colorsRoute from './modules/colors/colors.route'
import productsRoute from './modules/products/products.route'
import sizesRoute from './modules/sizes/sizes.route'
import storesRoute from './modules/stores/stores.route'
import { errorHandler } from './utils/error'

const api = new Hono({ strict: false }).basePath('/api/v1')

api.use(logger())
api.use('*', requestId())
api.use(serializeUserMiddleware)

const routes = api
    .route('/auth', authRoute)
    .route('/stores', storesRoute)
    .route('/stores/:storeId/billboards', billboardsRoute)
    .route('/stores/:storeId/categories', categoriesRoute)
    .route('/stores/:storeId/sizes', sizesRoute)
    .route('/stores/:storeId/colors', colorsRoute)
    .route('/products', productsRoute)

api.use(notFoundMiddleware)
api.onError(errorHandler)

export type ApiType = typeof routes

export default api
