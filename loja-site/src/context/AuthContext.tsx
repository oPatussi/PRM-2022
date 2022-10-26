import { IUser } from "@typesCustom";
import { createContext, ReactNode, useEffect, useState } from "react";

type AuthContextType = {
    user: IUser | undefined;
    registerSignIn(user: IUser): void;
    signOut(): void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthContextProviderProp = {
    children: ReactNode;
}

export function AuthContextProvider(props: AuthContextProviderProp) {
    const [user, setUser] = useState<IUser>();

    const keyUser = '@PRM:loja:user';

    useEffect(() => {

        //Leio o usuário e o customer do localStorage
        const storageUser = localStorage.getItem(keyUser);

        if (storageUser) {
            //Determino o valores dos states
            setUser(JSON.parse(storageUser));
        }

    }, []);

    async function registerSignIn(user: IUser) {

        //Determino o valores dos states
        setUser(user);

        //Gravo o usuário no localStorage
        localStorage.setItem(keyUser, JSON.stringify(user));
    }

    function signOut() {
        localStorage.clear();
        setUser({} as IUser);
    }

    return (
        <AuthContext.Provider value={{ user, registerSignIn, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}

