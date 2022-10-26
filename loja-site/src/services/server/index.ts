import { IOrder, ICredential, ICustomer, ICategory, IProduct, IUser } from '@typesCustom';
import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3300'
});

const _ACCOUNT = '/account/loja';
const _BACKOFFICE = '/backoffice';

//CATEGORIES
const getCategories = async () => {
    const result = await api.get(`${_BACKOFFICE}/categories`)
    const categories: ICategory[] = result.data;

    //Retorna a lista ordenada por "name"
    return new Promise<ICategory[]>(resolve => {
        resolve(categories.sort((a, b) => (a.name > b.name ? 1 : -1)) as ICategory[]);
    });
};

//PRODUCTS
const getProducts = async () => {
    const result = await api.get(`${_BACKOFFICE}/products`)
    const products: IProduct[] = result.data;

    //Retorna somente produtos ativos
    return new Promise<IProduct[]>(resolve => {
        resolve(products.filter(item => item.active == 'S') as IProduct[]);
    });
};
const getProductsByCategory = async (category: ICategory) => {
    const result = await api.get(`${_BACKOFFICE}/products`);
    const products: IProduct[] = result.data;

    //Retorna os produtos por categoria
    return new Promise<IProduct[]>(resolve => {
        resolve(products.filter(item => item.category.id == category.id) as IProduct[]);
    });
};
const getProductById = async (id: number) => {
    const result = await api.get(`${_BACKOFFICE}/products/${id}`);
    const product: IProduct = result.data;

    return new Promise<IProduct>(resolve => {
        resolve(product);
    });
};

//ACCOUNT
const signIn = async (credential: ICredential) => {
    try {
        const result = await api.post(`${_ACCOUNT}/signin`, credential);
        return new Promise<IUser>(resolve => {
            resolve(result.data.user as IUser);
        });
    } catch (e) {
        const error: AxiosError = e as AxiosError;
        return new Promise<IUser>((resolve, reject) => {
            reject({ status: error.response?.status, message: error.response?.data });
        });
    }
}

//USER & CUSTOMERS
const createUserCustomer = async (user: IUser, customer: ICustomer) => {
    try {
        const data = {
            user,
            customer
        }
        const result = await api.post(`${_ACCOUNT}/userCustomers`, data);

        return new Promise<IUser>(resolve => {
            resolve(result.data as IUser);
        });
    } catch (e) {
        const error: AxiosError = e as AxiosError;
        return new Promise<IUser>((resolve, reject) => {
            reject({ status: error.response?.status, message: error.response?.data });
        });
    }
}

export { getCategories, getProducts, getProductsByCategory, getProductById, signIn, createUserCustomer };