import { Hono } from 'hono'
import * as productsController from './products.controller'

const productsRoute = new Hono()
    .get('/', ...productsController.getProducts)
    .post('/', ...productsController.createProduct)
    .get('/:productId', ...productsController.getSingleProduct)
    .patch('/:productId', ...productsController.updateProduct)
    .delete('/:productId', ...productsController.deleteProduct)

export default productsRoute
