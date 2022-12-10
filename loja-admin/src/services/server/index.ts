import { ICredential, ICategory, IBrand, IProduct, IUser, IOrder, ICustomer } from '@typesCustom';
import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3300'
});

//Endpoint dos serviços
const _ACCOUNT = '/account/admin';
const _BACKOFFICE = '/backoffice';


//CATEGORIES
const listCategories = () => (api.get(`${_BACKOFFICE}/categories`));
const createCategory = (data: ICategory) => (api.post(`${_BACKOFFICE}/categories`, data));
const deleteCategory = (id: number) => (api.delete(`${_BACKOFFICE}/categories/${id}`));
const updateCategory = (data: ICategory) => (api.put(`${_BACKOFFICE}/categories/${data.id}`, data));


//BRANDS
const listBrands = () => (api.get(`${_BACKOFFICE}/brands`));
const createBrand = (data: IBrand) => (api.post(`${_BACKOFFICE}/brands`, data));
const deleteBrand = (id: number) => (api.delete(`${_BACKOFFICE}/brands/${id}`));
const updateBrand = (data: IBrand) => (api.put(`${_BACKOFFICE}/brands/${data.id}`, data));


//PRODUCTS
const listProducts = () => (api.get(`${_BACKOFFICE}/products`));
const createProduct = (data: IProduct) => (api.post(`${_BACKOFFICE}/products`, data));
const deleteProduct = (id: number) => (api.delete(`${_BACKOFFICE}/products/${id}`));
const updateProduct = (data: IProduct) => (api.put(`${_BACKOFFICE}/products/${data.id}`, data));
const getProductImages = (id: number) => (api.get(`${_BACKOFFICE}/products/${id}/images`));


//ORDERS
const listOrders = () => (api.get(`${_BACKOFFICE}/orders`));
const createOrder = (data: IOrder) => (api.post(`${_BACKOFFICE}/orders`, data));
const cancelOrder = (id: number) => (api.put(`${_BACKOFFICE}/orders/${id}`));
const changeStatus = (data: IOrder) => (api.put(`${_BACKOFFICE}/orders/${data.id}/status`, data));

//SALES
const createSale = (data: IOrder) => (api.put(`${_BACKOFFICE}/orders/${data.id}/invoiced`, data));
const listSales = () => (api.get(`${_BACKOFFICE}/sales`));

//USERS
const listUsers = () => (api.get(`${_ACCOUNT}/users`));
const createUser = (data: IUser) => (api.post(`${_ACCOUNT}/users`, data));
const deleteUser = (uid: string) => (api.delete(`${_ACCOUNT}/users/${uid}`));
const updateUser = (data: IUser) => (api.put(`${_ACCOUNT}/users/${data.uid}`, data));

//CUSTOMERS
const listCustomers = () => (api.get(`${_BACKOFFICE}/customers`));
const deleteCustomer = (id: number) => (api.delete(`${_BACKOFFICE}/customers/${id}`));
const updateCustomer = (data: ICustomer) => (api.put(`${_BACKOFFICE}/customers/${data.id}`, data));


//ACCOUNT
const signInAdmin = async (credential: ICredential) => {
    try {
        const result = await api.post(`${_ACCOUNT}/signin`, credential);

        return new Promise(resolve => {
            resolve(result.data);
        });
    } catch (e) {
        const error: AxiosError = e as AxiosError;

        return new Promise((resolve, reject) => {
            reject(error.response?.data);
        });
    }
}

export {
    listCategories, createCategory, deleteCategory, updateCategory,
    listBrands, createBrand, deleteBrand, updateBrand,
    listProducts, createProduct, deleteProduct, updateProduct,getProductImages,
    listOrders, createOrder, cancelOrder, changeStatus, 
    createSale, listSales,
    listUsers, createUser, deleteUser, updateUser,
    listCustomers, deleteCustomer, updateCustomer,
    signInAdmin
};