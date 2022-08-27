import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source"
import routes from "./routes";

//Instacia uma aplicação express
const app = express();

//Determina a porta de execução
const PORT = 3300;

//Middleware
app.use(cors());
app.use(express.json());

//Importa as rotas
app.use('/server',routes)


//Tenta conexão, caso erro, mostra log
AppDataSource.initialize()
    .then(() =>{
        app.listen(PORT, () => {
            console.log(`Running in port ${PORT}`);
        })

    })
    .catch(error => {
        console.log('Ops, não conectei no banco de dados', error);
    });