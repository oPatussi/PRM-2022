import { Router } from 'express';
import AccountController from './controller/AccountController';
import AuthController from './controller/AuthController';

//Instancio o reouter do express
const routes = Router();

//Rotas de Autenticação
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
    .post(AccountController.createUserLikeCustomer);

export default routes;