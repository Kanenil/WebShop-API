export interface IProduct {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
  decreasePercent: string;
  images: string[];
}

export interface IProductSearch {
  page?: number | string | null;
  search?: string;
  category?: string;
  sort?: string;
  countOnPage?: number | string | null;
}

export interface IProductResult {
  products: Array<IProduct>;
  pages: number;
  currentPage: number;
  total: number;
}

export interface ISortOption
{
    label: string;
    value: string;
}

export interface IProductFilterItem
{
  label:string;
  value: boolean; 
}

export interface IProductFilter
{
  label:string;
  items: IProductFilterItem[];
}

export function filterNonNull(obj: IProductSearch) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));
}