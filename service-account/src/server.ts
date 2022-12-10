import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

//Carrego as variaveis de ambiente da aplicação
dotenv.config();

//Instancio uma aplicação express
const app = express();

//Determina a porta de execução
const PORT = process.env.PORT || 3302;

//Middleware
app.use(cors());
app.use(express.json());

//Importa as rotas
app.use('/account', routes);


//Inicio a aplicação
app.listen(PORT, () => {
    console.log(`Service Account running in port ${PORT}`);
});