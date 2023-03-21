import { ICategoryItem } from './../types';
export interface ICategorySearch {
    page?: number | string | null;
    search?: string;
    countOnPage?: number | string | null;
  }
  
  export interface ICategoryResult {
    categories: Array<ICategoryItem>;
    pages: number;
    currentPage: number;
    total: number;
  }