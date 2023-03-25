import { IOrderItem } from "../../orders/list/types";

export interface ITableOrder extends IOrderItem
{
    email: string;
    name: string;
    image: string;
}

export interface ITableOrderResponce
{
    pages:number;
    currentPage: number;
    total:number;
    orders: ITableOrder[];
}

export interface IOrderStatus
{
    id: number;
    name: string;
    email: string;
}