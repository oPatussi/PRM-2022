import { Request, Response } from "express";
import { TypeORMError } from "typeorm";
import { Brand } from "../entity/Brand";

class BrandController{

    public async index(request: Request, response: Response){
        try {
            //Busca todos os registros
            const brands = await Brand.find();

            //Retorno da lista
            return response.json(brands);

        } catch (e) {
            const error = e as TypeORMError;
            return response.status(500).json({message: error.message});
        }
    }

    public async create(request: Request, response: Response){
        try {
            //Salva no banco a entidade que que foi requisitada
            const brands = await Brand.save(request.body);

            //Retorno da lista
            return response.status(201).json(brands);

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
            const found = await Brand.findOneBy({
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

    
    public async update(request: Request, response: Response){
        try {
            //Pega o ID que foi enviado por request param
            const {id} = request.params;

            //Verifica se recebeu o parametro ID
            if(!id){
                return response.status(400).json({message: 'Parametro ID não informado'})
            }
 
            const found = await Brand.findOneBy({id: Number(id)});

            //Verifico se encontrou a brand
            if(!found){
                return response.status(404).json({message: 'Recurso não encontrado'})
            }

            //Atualiza com os novos dados
            const brand = await Brand.update(found.id, request.body);

            return response.json(brand);
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
            const found = await Brand.findOneBy({
                id: Number(id)
            });


            //Verifico se encontrou a brand
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

export default new BrandController();