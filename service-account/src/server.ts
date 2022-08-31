import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from "./routes";

//Carrega as variáveis de ambiente da app
dotenv.config();

//Instacia uma aplicação express
const app = express();

//Determina a porta de execução
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

//Importa as rotas
app.use('/account',routes)


//Tenta conexão, caso erro, mostra log
app.listen(PORT, () => {
    console.log(`Running in port ${PORT}`);
})
