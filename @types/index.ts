export interface IBrand {
    id?: number;
    name: string;
}

export interface ICategory {
    id?: number;
    name: string;
}

export interface IProduct {
    id?: number;
    name: string;
    description?: string;
    price: number;
    active: string;
    category: ICategory;
    brand?: IBrand;
    images?: IProductImage[];
}

export interface IProductImage {
    id?: number;
    imageURL: string;
}

export interface ICustomer {
    id?: number;
    name: string;
    address?: string;
    zipcode?: string;
    state?: string;
    city?: string;
    uid?: string;
}

export interface IOrderItem {
    product: IProduct;
    amount: number;
    value: number;
}

export interface IOrder {
    id?: number;
    customer: ICustomer;
    deadline?: Date;
    shipping?: number;
    orderDate: Date;
    invoicedDate?: Date;
    canceledDate?: Date;
    items?: IOrderItem[];
    status?: string;
}

export interface ISale{
    id?: number;
    order: IOrder;
    saleDate: Date;
    total: number;
}

export interface ICredential {
    email: string;
    password: string;
}

export interface IUser {
    uid?: string;
    email: string;
    name: string;
    password?:string;
}