import { Request, Response } from "express";
import { TypeORMError } from "typeorm";
import { Order } from "../entity/Order";

class OrderController{

    public async index(request: Request, response: Response){
        try {
            //Busca todos os registros
            const orders = await Order.find();

            //Retorno da lista
            return response.json(orders);

        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async create(request: Request, response: Response){
        try {
            //Salva no banco a entidade que que foi requisitada
            const orders = await Order.save(request.body);

            //Retorno da lista
            return response.status(201).json(orders);

        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async show(request: Request, response: Response){
        try {
            //Pega o ID que foi enviado por request param
            const {id} = request.params;

            //Verifica se recebeu o parametro ID
            if(!id){
                return response.status(400).json({message: 
                'Parametro ID não informado'})
            }

            //Busco a entity no banco pelo id
            const found = await Order.findOneBy({
                id: Number(id)
            });


            //Verifico se encontrou a brand
            if(!found){
                return response.status(404).json({message: 'Recurso não encontrado'})
            }

            return response.json(found);

        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async cancel(request: Request, response: Response){
        try {
            //Pega o ID que foi enviado por request param
            const {id} = request.params;

            //Verifica se recebeu o parametro ID
            if(!id){
                return response.status(400).json({message: 'Parametro ID não informado'})
            }
 
            const found = await Order.findOneBy({id: Number(id)});

            //Verifico se encontrou a brand
            if(!found){
                return response.status(404).json({message: 'Recurso não encontrado'})
            }

            //Atualiza com os novos dados
            await Order.update(found.id, request.body);

            const novo = request.body;

            //altera o id para o request recebido
            novo.canceledDate = new Date();

            return response.json(novo);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

}

export default new OrderController();