import { Hono } from 'hono'
import * as colorsController from './colors.controller'

const colorsRoute = new Hono()
    .get('/', ...colorsController.getColors)
    .post('/', ...colorsController.createColor)
    .get('/:colorId', ...colorsController.getSingleColor)
    .patch('/:colorId', ...colorsController.updateColor)
    .delete('/:colorId', ...colorsController.deleteColor)

export default colorsRoute
