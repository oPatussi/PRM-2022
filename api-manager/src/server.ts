import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { createProxyMiddleware } from "http-proxy-middleware";

//Carrega as variáveis de ambiente
dotenv.config();

//Instacia uma aplicação express
const app = express();

//Determina a porta de execução
const PORT = process.env.PORT || 3300;

//Middleware
app.use(cors());

//Rotas do proxy
app.use('/account', createProxyMiddleware({
    target: 'http://localhost:3302'
}))

app.use('/backoffice', createProxyMiddleware({
    target: 'http://localhost:3301'
}))


//Inicia a aplicação
app.listen(PORT, () => {
    console.log(`API Manager running in port ${PORT}`);
    })
