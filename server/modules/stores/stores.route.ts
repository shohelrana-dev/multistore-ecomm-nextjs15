import { Hono } from 'hono'
import * as storesController from './stores.controller'

const storesRoute = new Hono()
    .get('/', ...storesController.getStores)
    .post('/', ...storesController.createStore)
    .patch('/:storeId', ...storesController.updateStore)
    .delete('/:storeId', ...storesController.deleteStore)
    .get('/:storeId', ...storesController.getSingleStore)

export default storesRoute
