import {ICredential, IUser} from '@typesCustom';
import {Request, Response} from "express";
import {FirebaseError,signInAdmin} from '../services/firebase';

class AuthController{

    public async signInAdmin(request: Request, response: Response){
        const credentials = request.body;

        try {
            
            const result = await signInAdmin(credentials.email, credentials.password);

            const user: IUser = {
                uid: result.user.uid,
                name: result.user.displayName || '',
                email: result.user.email || credentials.email 
            }

            const accessToken = await result.user.getIdToken();

            return response.json({user: user, token: accessToken});

        } catch (e) {
            const error = e as FirebaseError;
        
            //Bad request
            if(error.code === 'auth/missing-email'){
                return response.status(400).json({ message:'É preciso informar um email'})
            }

            //Não achou o usuário
            if(error.code === 'auth/user-not-found'){
                return response.status(401).json({ message:'Úsuário não encontrado'})
            }

            //Senha errada
            if(error.code === 'auth/wrong-password'){
                return response.status(401).json({ message:'Senha incorreta'})
            }

            response.status(500).json(e);
            
        }

    }
}

export default new AuthController();