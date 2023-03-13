import { IPagination, PaginationActionType } from "./types";

const curPage = localStorage.getItem('currentPage');
const search = localStorage.getItem('searchBy');

const initState: IPagination = {
    currentPage: curPage?parseInt(curPage):1,
searchBy:search?search:""
  };
  
  export const PaginationReducer = (state = initState, action: any) => {
    switch (action.type) {
      case PaginationActionType.CURRENT_PAGE_CHANGED:
        const dec = localStorage.getItem('currentPage');
        return {
          ...state,
          currentPage: dec,
        };
        case PaginationActionType.SEARCH_CHANGED:
          const search = localStorage.getItem('searchBy');
          return {
            ...state,
            searchBy: search,
          };
    }
    return state;
  };