import {ICredential} from '@typesCustom';
import { PrimaryButton, Stack, TextField } from "@fluentui/react";
import {useState, useEffect} from "react";
import { signInAdmin } from '../../services/server';
import { useAuth } from '../../hook/useAuth';

export function LoginPage(){

    const {user, signIn} = useAuth();

    const [credential, setCredential] = useState<ICredential>({
        email: '',
        password: ''
    })

    async function handleSingIn(event: FormDataEvent){
        event.preventDefault();

        try {
            await signInAdmin(credential);
        }catch (e) {
            console.log(e);
        }      
        
        console.log(credential);
    }

    return (
        <div id="home page">
            <Stack horizontal={false}>
                <form>
                    <TextField label="E-mail"
                    value={credential.email}
                    onChange={event => setCredential({...credential,email: (event.target as HTMLInputElement).value})} />

                    <TextField label="Senha"
                    type="password"
                    value={credential.password}
                    onChange={event => setCredential({...credential,password: (event.target as HTMLInputElement).value})} />
                    
                    <PrimaryButton
                        type="submit">
                        <span>Entrar</span>
                        </PrimaryButton>
                </form>

                <h2># {JSON.stringify(user)} #</h2>

            </Stack>
        </div>
    )
}