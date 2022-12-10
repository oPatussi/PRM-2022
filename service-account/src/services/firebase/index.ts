import * as admin from 'firebase-admin';

import { initializeApp, FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


import dotenv from 'dotenv';

const serviceAccount = require('./certs/service-account.json');

//Inicialização do Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

import { IUser } from "@typesCustom";

//Carregar variaveis de ambiente
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Atutenticação
const signInAdmin = (email: string, password: string) => (signInWithEmailAndPassword(getAuth(), email, password));

//Usuarios
const listUsers = () => admin.auth().listUsers(1000);

const createUser = (user: IUser) => (admin.auth().createUser({
  email: user.email,
  emailVerified: true,
  password: user.password,
  displayName: user.name,
  disabled: false
}));

//Usuario Clientes
const createUserCustomer = (user: IUser) => {

    //Aqui, estou retornando a função createUser, mas deve ser implentado 
    //diferente pela equipe, adicionando o retorno como Promise
    return createUser(user);

    //TO-DO: Adicionar claim (customer: true) aqui
} 

const getUser = (uid: string) => admin.auth().getUser(uid);
const updateUser = (uid: string, data: any) => admin.auth().updateUser(uid, data);
const deleteUser = (uid: string) => admin.auth().deleteUser(uid);

export { FirebaseError, signInAdmin, 
  listUsers, createUser, getUser, updateUser, deleteUser,
  createUserCustomer
 }