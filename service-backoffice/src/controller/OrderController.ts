import { Sale } from './../entity/Sale';
import { Request, Response } from "express";
import { IsNull, TypeORMError } from "typeorm";
import { Order } from "../entity/Order";


class OrderController {

    public async index(request: Request, response: Response) {
        try {
            //Buscar TODOS os registros do banco
            const orders = await Order.find({
                where: {
                    invoicedDate: IsNull()
                }
            });

            //Retorno a lista
            return response.json(orders);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async create(request: Request, response: Response) {
        try {
            //Salvo no banco a entidade que veio na requisição
            const order = await Order.save(request.body);

            //Retorno a entidade inserida
            return response.status(201).json(order);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async show(request: Request, response: Response) {
        try {
            //Pego o ID que foi enviado por request param
            const {id} = request.params;

            //Verifico se veio o parametro ID
            if (!id) {
                return response.status(400).json({message: 'Parâmetro ID não informado'})
            }

            //Busco a entity no banco pelo ID
            const found = await Order.findOneBy({
                id: Number(id)
            });

            //Verifico se encontrou a order
            if (!found) {
                return response.status(404).json({message: 'Recurso não encontrado'})
            }

            //Retorno a entidade encontrada
            return response.json(found);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async canceled(request: Request, response: Response) {
        try {
            //Pego o ID que foi enviado por request param
            const {id} = request.params;

            //Verifico se veio o parametro ID
            if (!id) {
                return response.status(400).json({message: 'Parâmetro ID não informado'})
            }

            //Busco a entity no banco pelo ID
            const found = await Order.findOneBy({
                id: Number(id)
            });

            //Verifico se encontrou a order
            if (!found) {
                return response.status(404).json({message: 'Recurso não encontrado'})
            }

            //Determina a data de cancelamento (este campo indica que o pedido está cancelado)
            request.body.canceledDate = new Date();

            //Atualizo com os nos dados
            await Order.update(found.id, request.body);

            const novo = request.body;

            //Altero o ID para o que veio no request
            novo.id = found.id;

            //Retorno a entidade encontrada
            return response.json(novo);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async invoiced(request: Request, response: Response) {
        try {
            //Pego o ID que foi enviado por request param
            const {id} = request.params;

            //Verifico se veio o parametro ID
            if (!id) {
                return response.status(400).json({message: 'Parâmetro ID não informado'})
            }

            //Busco a entity no banco pelo ID
            const found = await Order.findOneBy({
                id: Number(id)
            });

            //Verifico se encontrou a brand
            if (!found) {
                return response.status(404).json({message: 'Recurso não encontrado'})
            }

            //Soma o total de todos os itens
            let total = 0;
            for (let itemOrder of found.items) {
                total += (itemOrder.amount * itemOrder.product.price)
            }

            //Preparo a venda para salvar
            const sale: any = {
                order: found,
                saleDate: new Date(),
                total: total
            }

            //Salvo a venda
            await Sale.save(sale);

            //Determina a data de faturamento do pedido já faturado
            request.body.invoicedDate = new Date();

            //Determina o status do pedido
            request.body.status = 'Novo';

            //Atualizo com os nos dados
            const novo = await Order.save(request.body);

            //Retorno a entidade encontrada
            return response.json(novo);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async changeStatus(request: Request, response: Response) {
        try {
            //Pego o ID que foi enviado por request param
            const {id} = request.params;

            //Verifico se veio o parametro ID
            if (!id) {
                return response.status(400).json({message: 'Parâmetro ID não informado'})
            }

            //Busco a entity no banco pelo ID
            const found = await Order.findOneBy({
                id: Number(id)
            });

            //Verifico se encontrou a brand
            if (!found) {
                return response.status(404).json({message: 'Recurso não encontrado'})
            }

            //Atualizo com os nos dados
            const novo = await Order.save(request.body);

            //Retorno a entidade encontrada
            return response.json(novo);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }
}

export default new OrderController();