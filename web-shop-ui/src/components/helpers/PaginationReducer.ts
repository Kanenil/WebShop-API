import { IPagination, PaginationActionType } from "./types";

const initState: IPagination = {
  currentPage: 1,
};

export const PaginationReducer = (state = initState, action: any) => {
  switch (action.type) {
    case PaginationActionType.CURRENT_PAGE_CHANGED:
      return {
        ...state,
        currentPage: action.payload,
      };
  }
  return state;
};

export const setCurrentPage = (currentPage: number) => ({
  type: PaginationActionType.CURRENT_PAGE_CHANGED,
  payload: currentPage,
});
