import { IUser } from '@typesCustom';

import { Request, Response } from "express";
import { createUser, deleteUser, FirebaseError, getUser, listUsers, updateUser } from "../services/firebase";

class AccountController {

    //Retorno TODOS os usuários
    public async listAll(request: Request, response: Response) {
        try {
            //Buscar TODOS os usuários do Firebase
            const result = await listUsers();

            //Monta o vetor de retorno
            const users = Array<IUser>();

            await result.users.map(item => {
                users.push({
                    uid: item.uid,
                    name: item.displayName || '',
                    email: item.email || ''
                })
            })

            //Retorno a lista com TODOS os usuários
            return response.json(users);
        } catch (e) {
            const error = e as FirebaseError;
            return response.status(500).json({message: error.message})
        } 
    }

    public async listUsers(request: Request, response: Response) {
        //TO-DO: implementar retorno de usuário do site admin
    }

     //Adiciono um usuario 
     public async createUser(request: Request, response: Response) {        
        const {user} = request.body;

        try { 
            
            //Cria um novo usuário bo firebase
            const result = await createUser(user);

            //Prepara o retorno
            const newUser: IUser = {
                uid: result.uid,
                name: result.displayName || '',
                email: result.email || ''
            }

            //Retorno o objeto inserido
            return response.status(201).json(newUser);

        } catch (e) {
            const error = e as FirebaseError;
            return response.status(500).json({message: error.message})
        }
     }

     //Retorno o usuário conforme o ID vindo pro request param
     public async show(request: Request, response: Response) {
         
         try {
             //Pegar o UID do usuário do request params
             const { uid } = request.params;
 
             //Pego o usuario pelo UID
             const result = await getUser(uid);
 
             //Prepara o retorno
             const user: IUser = {
                 uid: result.uid,
                 name: result.displayName || '',
                 email: result.email || ''
             }
 
             //Retorno o usuario
             return response.json(user);
         } catch (e) {
             const error = e as FirebaseError;
 
             //Not found
             if (error.code === 'auth/user-not-found') {
                 return response.status(404).json({message: 'Usuário não encontrado'})
             }
 
             return response.status(500).json({message: error.message});
         }
      }

     //Atualizo um marca
     public async update(request: Request, response: Response) {
        
        try {
            //Pegar o UID do usuário do request params
            const { uid } = request.params;

            //Carrega o usuario pelo UID, se não encontrar, cairá no catch
            await getUser(uid);

            //Atualiza o registro
            const result = await updateUser(uid, {
                password: request.body.password,
                displayName: request.body.name
            });

            //Prepara o retorno
            const user: IUser = {
                uid: result.uid,
                name: result.displayName || '',
                email: result.email || ''
            }

            //Retorno o objeto atualizado
            return response.json(user);

        } catch (e) {
            const error = e as FirebaseError;

            //Not found
            if (error.code === 'auth/user-not-found') {
                return response.status(404).json({message: 'Usuário não encontrado'})
            }

            return response.status(500).json({message: error.message})
        }
     }

     //Removo o usuario
     public async remove(request: Request, response: Response) {
        
        try {
            //Pegar o UID do usuário do request params
            const { uid } = request.params;

            //Carrega o usuario pelo UID, se não encontrar, cairá no catch
            await getUser(uid);

            //Remove o usuário pelo UID
            await deleteUser(uid);

            //Retorno o status 204 avisando que foi excluído e não tem retorno
            return response.status(204).json();
        } catch (e) {
            const error = e as FirebaseError;

            //Not found
            if (error.code === 'auth/user-not-found') {
                return response.status(404).json({message: 'Usuário não encontrado'})
            }

            return response.status(500).json({message: error.message})
        }
     }
}

export default new AccountController();