import { createContext, useState, ReactNode } from "react";
import {IUser, ICredential} from '@typesCustom';
import { signInAdmin } from "../services/server";
import { useEffect } from "react";


type AuthContextType = {
    user: IUser | undefined;
    signIn(credential: ICredential):void; 
    signOut(): void;   
}
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthContextProviderProps = {
    children: ReactNode;
}
export function AuthContextProvider(props:AuthContextProviderProps){

    const [user, setUser] = useState<IUser>()

    //Chaves da local Storage
    const keyUser = '@PRM:user'

    useEffect(() =>{

        const storageUser = localStorage.getItem(keyUser);

        if(storageUser){
            setUser(JSON.parse(storageUser));
        }
    }, [])

    async function signIn(credential: ICredential) {
        try {
            
            const result = await signInAdmin(credential) as any;

            if (result) {
                setUser(result.user);

                //Gravar na localstorage o usuário
                localStorage.setItem(keyUser, JSON.stringify(result.user));
            }

        } catch (error) {
            throw error;
        }
    }

    function signOut(){
        localStorage.removeItem(keyUser);
        setUser({} as IUser);
    }


    return(
        <AuthContext.Provider value={{user, signIn, signOut}}>
            {props.children}
        </AuthContext.Provider>
    )
}