import { createContext, ReactNode } from "react";
import {ICredential, IUser} from '@typesCustom';
import { useState } from "react";
import { signInAdmin } from "../services/server";
import { useEffect } from "react";


type AuthContextType = {
    user: IUser | undefined;
    signIn(credential: ICredential): void;
    signOut(): void;
}
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthContextProviderProp = {
    children: ReactNode;
}
export function AuthContextProvider(props: AuthContextProviderProp) {
    const [user, setUser] = useState<IUser>();

    //Chaves da Local Storage
    const keyUser = '@PRM:user'

    useEffect(() => {

        //Leio o usuario da Local Storage
        const storageUser = localStorage.getItem(keyUser);

        if (storageUser) {
            setUser(JSON.parse(storageUser));
        }

    }, []);

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

    function signOut() {
        localStorage.removeItem(keyUser);
        setUser({} as IUser);
    }

    return (
        <AuthContext.Provider value={{user, signIn, signOut}}>
            {props.children}
        </AuthContext.Provider>
    )
}