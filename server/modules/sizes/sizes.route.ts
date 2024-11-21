import { Hono } from 'hono'
import * as sizesController from './sizes.controller'

const sizesRoute = new Hono()
    .get('/', ...sizesController.getSizes)
    .post('/', ...sizesController.createSize)
    .get('/:sizeId', ...sizesController.getSingleSize)
    .patch('/:sizeId', ...sizesController.updateSize)
    .delete('/:sizeId', ...sizesController.deleteSize)

export default sizesRoute
