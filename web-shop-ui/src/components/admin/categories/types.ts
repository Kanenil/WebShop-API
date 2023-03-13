export interface ICategoryItem 
{
    id: number;
    name:string;
    image:string;
}

export interface IPagination {
    currentPage: number,
    searchBy: string
};

export enum PaginationActionType {
    CURRENT_PAGE_CHANGED="CURRENT_PAGE_ACTION",
    SEARCH_CHANGED="SEARCH_ACTION",
}