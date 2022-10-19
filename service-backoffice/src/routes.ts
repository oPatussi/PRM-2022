import {Router} from 'express';
import BrandController from './controler/BrandController';
import CategoryController from './controler/CategoryController';
import CustomerController from './controler/CustomerController';
import OrderController from './controler/OrderController';
import ProductController from './controler/ProductController';

//instaciar o router do express
const routes = Router();


//rota Brands
routes.route('/brands')
    .get(BrandController.index)
    .post(BrandController.create);

routes.route('/brands/:id')
    .get(BrandController.show)
    .put(BrandController.update)
    .delete(BrandController.remove)
;


//rota Category
routes.route('/categories')
    .get(CategoryController.index)
    .post(CategoryController.create);

routes.route('/categories/:id')
    .get(CategoryController.show)
    .put(CategoryController.update)
    .delete(CategoryController.remove)
;


//rota Product
routes.route('/products')
    .get(ProductController.index)
    .post(ProductController.create);

routes.route('/products/:id')
    .get(ProductController.show)
    .put(ProductController.update)
    .delete(ProductController.remove)
;

//rota Customer
routes.route('/customer')
    .get(CustomerController.index)
    .post(CustomerController.create);

routes.route('/customer/:id')
    .get(CustomerController.show)
    .put(CustomerController.update)
    .delete(CustomerController.remove)
;

//rota Order
routes.route('/orders')
    .get(OrderController.index)
    .post(OrderController.create);

routes.route('/orders/:id')
    .get(OrderController.show)
    .put(OrderController.cancel)
;

export default routes;