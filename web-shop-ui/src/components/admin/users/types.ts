import { IProduct } from './../../products/types';

export interface IUserSearch
{
    page:number | string;
    search:string;
    countOnPage: number | string;
}

export interface IUserItem
{
    fullname:string;
    image:string;
    email:string;
    emailConfirmed:boolean;
    banned:boolean;
    bannedTo:string | null;
    roles:string;
    cart:IProductBasket[];
}

export interface IProductBasket
{
    count: number;
    product: IProduct;
}

export interface IUserSearchResult
{
    users: IUserItem[];
    pages:number;
    currentPage:number;
    total:number;
}

export interface IEditUser
{
    email: string;
    time: string;
    role: string;
}
