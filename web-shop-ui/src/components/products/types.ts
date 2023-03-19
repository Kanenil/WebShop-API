import { IProductTableItem } from "../admin/products/types";

export interface IProduct {
  name: string;
  price: string;
  description: string;
  category: string;
  images: string[];
}
export interface IFilterItem {
  value: string;
  label: string;
  checked: boolean;
}

export interface ISortOption {
  name: string;
  href: string;
  current: boolean;
}

export interface IFilter {
  id: string;
  name: string;
  options: IFilterItem[];
}

export interface IProductSearch {
  page?: number | string | null;
  search?: string;
  category?: string;
  sort?: string;
  countOnPage?: number;
}

export interface IProductResult {
  products: Array<IProductTableItem>;
  pages: number;
  currentPage: number;
  total: number;
}