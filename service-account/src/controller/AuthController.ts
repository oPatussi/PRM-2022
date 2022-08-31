import {ICredential} from '@typesCustom';
import {Request, Response} from "express";
import {FirebaseError,signInAdmin} from '../services/firebase';

class AuthController{

    public async signInAdmin(request: Request, response: Response){
        const credentials = request.body;

        try {
            
            const result = await signInAdmin(credentials.email, credentials.password);

            response.json(result);

        } catch (e) {
            response.status(500).json(e);
            
        }

    }
}

export default new AuthController();