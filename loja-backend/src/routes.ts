import {Router} from 'express';
import BrandController from './controler/BrandController';
import CategoryController from './controler/CategoryController';
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
    .get(CategoryController.index)
    .post(CategoryController.create);

routes.route('/products/:id')
    .get(ProductController.show)
    .put(ProductController.update)
    .delete(ProductController.remove)
;


export default routes;