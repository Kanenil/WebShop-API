export interface ICreateProduct
{
    name: string;
    description: string;
    categoryId: number;
    price: number;
    images: File[] | string[] | null;
}