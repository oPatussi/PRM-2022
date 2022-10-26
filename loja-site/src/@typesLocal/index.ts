import { IProduct } from '@typesCustom';

export interface ICartItem {
    product: IProduct;
    amount?: number;
}

export interface ICart {
    items?: ICartItem[] | [];
    shipping?: number;
}

export type RequestParam = {
    id?: string;
    redirect?:string;
}

export const FormaPagto = {
    'max': 1.25,
    'pix': 0.95,
    'vista': 1,
    'cartao': 1.15
}