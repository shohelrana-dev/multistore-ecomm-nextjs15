import { Hono } from 'hono'
import * as billboardsController from './billboards.controller'

const billboardsRoute = new Hono()
    .get('/', ...billboardsController.getBillboards)
    .post('/', ...billboardsController.createBillboard)
    .get('/:billboardId', ...billboardsController.getSingleBillboard)
    .patch('/:billboardId', ...billboardsController.updateBillboard)
    .delete('/:billboardId', ...billboardsController.deleteBillboard)

export default billboardsRoute
