import { AppDataSource } from './data-source';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';
import { connect, consumeCustomer } from './services/amqp';

//Carrego variaveis de ambiente
dotenv.config();

//Instancio uma aplicação express
const app = express();

//Determina a porta de execução
const PORT = process.env.PORT || 3301;

//Middleware
app.use(cors());
app.use(express.json());

//Importa as rotas
app.use('/backoffice', routes);

//Conecta no RabbitMQ
connect()
    .then(() => {
        console.log('Conectado ao RabbitMQ e pronto para consumi-lo');

        //Carrego os consumidores
        consumeCustomer();

    })
    .catch(error => {
        console.log('Não foi possível conectar ao RabbitMQ');
    });

//Tento conectar ao banco e, se não conseguir, mostro o erro.
AppDataSource.initialize()
    .then(() => {

        //Inicio a aplicação
        app.listen(PORT, () => {
            console.log(`Service backoffice running in port ${PORT}`);
        })

    })
    .catch(error => {
        console.log('Ops! Ocorreu um erro.');
        console.error(error);
    });


