import {Router} from 'express';
import AuthController from './controller/AuthController';

//instaciar o router do express
const routes = Router();


//rota Brands
routes.post('/admin/signin', AuthController.signInAdmin);

export default routes;