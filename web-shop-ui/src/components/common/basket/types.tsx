import { IProduct } from "../../products/types";

export interface ICart 
{
  isOpen: boolean;
  cart: ICartItem[];
}

export interface ICartItem 
{
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    quantity: number;
    decreasePercent: number;
}

export interface IBasketResponce
{
    list : IBasketItem[];
}

interface IBasketItem
{
  count:number;
    product: IProduct;
}

export enum CartActionType {
    SET_OPEN = "SET_OPEN_ACTION",
    SET_CART = "SET_CART_ACTION",
  }