
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

  export interface ICategoryItem 
{
    id: number;
    name:string;
    image:string;
}