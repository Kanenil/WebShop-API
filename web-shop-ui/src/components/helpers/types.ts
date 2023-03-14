export interface IPagination {
    currentPage: number
};

export enum PaginationActionType {
    CURRENT_PAGE_CHANGED="CURRENT_PAGE_ACTION",
}

export interface IPaginationInfo
{
    countItems: number;
    currentPage: number;
    countOnPage: number;
    url: string;
    onPageChange: (id: number) => void;
}