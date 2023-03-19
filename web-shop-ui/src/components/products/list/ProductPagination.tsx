import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import qs from "qs";
import { Link } from "react-router-dom";
import { IProductSearch } from "../types";

interface Prop
{
    countItems: number;
    countOnPage: number;
    currentPage: number;
    search: IProductSearch;
    onClick: (page:number)=>void;
}

export function filterNonNull(obj: IProductSearch) {
    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));
  }

export const ProductPagination : React.FC<Prop> = ({
  countItems,
  countOnPage,
  onClick,
  search,
  currentPage
}) => {
  const countPages = Math.ceil(countItems / countOnPage);
  const items = Array.from({ length: countPages }, (_, i) => i + 1);

  const content = items.map((page) => {
    if (page == 1) {
      return currentPage == page ? (
        <Link
          key={"page-" + page}
          onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
          aria-current={currentPage == page ? "page" : undefined}
          className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {page}
        </Link>
      ) : (
        <Link
          key={"page-" + page}
          onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          {page}
        </Link>
      );
    }

    if (currentPage <= 5) {
      if ((page != 1 && page <= 7) || (page == countPages && countPages != 1)) {
        return currentPage == page ? (
          <Link
            key={"page-" + page}
            aria-current={currentPage == page ? "page" : undefined}
            onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
            className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {page}
          </Link>
        ) : (
          <Link
            key={"page-" + page}
            onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            {page}
          </Link>
        );
      }

      if (page == 8 && countPages != page) {
        return (
          <Link
            key={"page-" + page}
            onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            ...
          </Link>
        );
      }
    } else if (currentPage > 5) {
      const range = countPages - currentPage;

      if (range <= 4) {
        const dot = currentPage - (7 - range);
        if (page == dot) {
          return (
            <Link
              key={"page-" + page}
              onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              ...
            </Link>
          );
        } else if (currentPage > countPages - 5 && page > dot) {
          return currentPage == page ? (
            <Link
              key={"page-" + page}
              onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              aria-current={currentPage == page ? "page" : undefined}
              className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {page}
            </Link>
          ) : (
            <Link
              key={"page-" + page}
              onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              {page}
            </Link>
          );
        }
      } else if (range >= 5) {
        const dotleft = currentPage - 3;
        const dotright = currentPage + 3;
        if (page == dotleft || page == dotright) {
          return (
            <Link
              key={"page-" + page}
              onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              ...
            </Link>
          );
        }
        if (page > dotleft && page < dotright) {
          return currentPage == page ? (
            <Link
              key={"page-" + page}
              onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              aria-current={currentPage == page ? "page" : undefined}
              className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {page}
            </Link>
          ) : (
            <Link
              key={"page-" + page}
              onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              {page}
            </Link>
          );
        }
        if (page == countPages) {
          return currentPage == page ? (
            <Link
              key={"page-" + page}
              onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              aria-current={currentPage == page ? "page" : undefined}
              className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {page}
            </Link>
          ) : (
            <Link
              key={"page-" + page}
              onClick={()=>onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              {page}
            </Link>
          );
        }
      }
    }
  });

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div></div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <Link
              onClick={()=>onClick(currentPage-1)}
              to={"?" + qs.stringify(filterNonNull({ ...search, page:currentPage-1 }))}
              className={
                "relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 " +
                (currentPage == 1 ? "disabled-link" : "")
              }
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            {content}
            <Link
              onClick={()=>onClick(currentPage+1)}
              to={"?" + qs.stringify(filterNonNull({ ...search, page:currentPage+1 }))}
              className={
                "relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 " +
                (currentPage + 1 > countPages ? "disabled-link" : "")
              }
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};
