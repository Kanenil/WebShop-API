export interface IEditProduct
{
    id:number | string;
    name: string;
    description: string;
    categoryId: number;
    price: number;
    images: File[] | string[] | null;
}