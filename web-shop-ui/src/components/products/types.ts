import { IProductTableItem } from "../admin/products/types";

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