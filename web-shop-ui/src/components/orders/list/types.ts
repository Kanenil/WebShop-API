export interface IOrderItem
{
    id:number;
    orderStatus:string;
    products:IOrderProductItem[];
}

export interface IOrderProductItem
{
    id:number;
    priceBuy:number;
    count:number;
    productImage:string;
    productName:string;
    categoryName:string;
}

export interface IOrderResponce
{
    pages:number;
    currentPage: number;
    total:number;
    orders: IOrderItem[];
}

export interface IOrderSearch
{
    page:number | string;
    countOnPage: number | string;
}