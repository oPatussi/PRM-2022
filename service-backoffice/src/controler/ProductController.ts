import { Request, Response } from "express";
import { TypeORMError } from "typeorm";
import { Product } from "../entity/Product";

class ProductController{

    public async index(request: Request, response: Response){
        try {
            //Busca todos os registros
            const products = await Product.find();

            //Retorno da lista
            return response.json(products);

        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async create(request: Request, response: Response){
        try {
            //Salva no banco a entidade que que foi requisitada
            const product = await Product.save(request.body);

            //Retorno da lista
            return response.status(201).json(product);

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
            const found = await Product.findOneBy({
                id: Number(id)
            });


            //Verifico se encontrou a product
            if(!found){
                return response.status(404).json({message: 'Recurso não encontrado'})
            }

            return response.json(found);

        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    
    public async update(request: Request, response: Response){
        try {
            //Pega o ID que foi enviado por request param
            const {id} = request.params;

            //Verifica se recebeu o parametro ID
            if(!id){
                return response.status(400).json({message: 'Parametro ID não informado'})
            }
 
            const found = await Product.findOneBy({id: Number(id)});

            //Verifico se encontrou a product
            if(!found){
                return response.status(404).json({message: 'Recurso não encontrado'})
            }

            //Atualiza com os novos dados
            await Product.update(found.id, request.body);

            const novo = request.body;

            //altera o id para o request recebido
            novo.id = found.id;

            return response.json(novo);
        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }


    public async remove(request: Request, response: Response){
        try {
            //Pega o ID que foi enviado por request param
            const {id} = request.params;

            //Verifica se recebeu o parametro ID
            if(!id){
                return response.status(400).json({message: 
                'Parametro ID não informado'})
            }

            //Busco a entity no banco pelo id
            const found = await Product.findOneBy({
                id: Number(id)
            });


            //Verifico se encontrou a product
            if(!found){
                return response.status(404).json({message: 'Recurso não encontrado'})
            }

            //Removo o registro baseado no ID
            await found.remove();

            //Retorno satus 2-4 que é sem retorno
            return response.status(204).json();

        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

}

export default new ProductController();