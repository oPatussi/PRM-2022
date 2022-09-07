import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source"
import routes from "./routes";
import dotenv from 'dotenv';

//Carrega as variáveis de ambiente
dotenv.config();

//Instacia uma aplicação express
const app = express();

//Determina a porta de execução
const PORT = process.env.PORT || 3301;

//Middleware
app.use(cors());
app.use(express.json());

//Importa as rotas
app.use('/backoffice',routes)


//Tenta conexão, caso erro, mostra log
AppDataSource.initialize()
    .then(() =>{
        app.listen(PORT, () => {
            console.log(`Service backoffice running in port ${PORT}`);
        })

    })
    .catch(error => {
        console.log('Ops, não conectei no banco de dados', error);
    });