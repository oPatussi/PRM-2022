import {Router} from 'express';
import AuthController from './controller/AuthController';
import AccountController from './controller/AccountController';

//instaciar o router do express
const routes = Router();


//rota Brands
routes.post('/admin/signin', AuthController.signInAdmin);

routes.post('/loja/signin', AuthController.signInAdmin); //TO-DO: Mudar para um método próprio

//Rotas da Loja Admin
routes.route('/admin/users')
    .get(AccountController.listAll)
    .post(AccountController.createUser);

routes.route('/admin/users/:uid')
    .get(AccountController.show)
    .put(AccountController.update)
    .delete(AccountController.remove);

//Rotas da Loja
routes.route('/loja/userCustomers')
    .post(AccountController.createUser);

export default routes;