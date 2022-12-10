import { Sale } from './../entity/Sale';
import { Request, Response } from "express";
import { TypeORMError } from "typeorm";


class SaleController {

    public async index(request: Request, response: Response) {
        try {
            //Buscar TODOS os registros do banco
            const sales = await Sale.find({
                order: {
                    id: 'DESC'
                }
            });

            //Retorno a lista
            return response.json(sales);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }
}

export default new SaleController();