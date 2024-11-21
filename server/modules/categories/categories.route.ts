import { Hono } from 'hono'
import * as categoriesController from './categories.controller'

const categoriesRoute = new Hono()
    .get('/', ...categoriesController.getCategories)
    .post('/', ...categoriesController.createCategory)
    .get('/:categoryId', ...categoriesController.getSingleCategory)
    .patch('/:categoryId', ...categoriesController.updateCategory)
    .delete('/:categoryId', ...categoriesController.deleteCategory)

export default categoriesRoute
