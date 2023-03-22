import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import qs from "qs";
import { Link } from "react-router-dom";
import { IProductSearch } from "../types";
import { filterNonNull } from "./types";

interface Prop {
  countItems: number;
  countOnPage: number;
  currentPage: number;
  search: IProductSearch;
  onClick: (page: number) => void;
}

export const ProductPagination: React.FC<Prop> = ({
  countItems,
  countOnPage,
  onClick,
  search,
  currentPage,
}) => {
  const countPages = Math.ceil(countItems / countOnPage);
  const items = Array.from({ length: countPages }, (_, i) => i + 1);

  const content = items.map((page) => {
    if (page == 1) {
      return (
        <Link
          key={"page-" + page}
          onClick={() => onClick(page)}
          to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
          className={classNames(
            "hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform rounded-md sm:inline dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200",
            { "bg-blue-500 dark:bg-blue-500 text-white": currentPage == page },
            { "bg-white dark:bg-gray-800": currentPage != page }
          )}
        >
          {page}
        </Link>
      );
    }

    if (currentPage <= 5) {
      if ((page != 1 && page <= 7) || (page == countPages && countPages != 1)) {
        return (
          <Link
            key={"page-" + page}
            onClick={() => onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
            className={classNames(
              "hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform rounded-md sm:inline dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200",
              {
                "bg-blue-500 dark:bg-blue-500 text-white": currentPage == page,
              },
              { "bg-white dark:bg-gray-800": currentPage != page }
            )}
          >
            {page}
          </Link>
        );
      }

      if (page == 8 && countPages != page) {
        return (
          <Link
            key={"page-" + page}
            onClick={() => onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
            className={classNames(
              "hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform rounded-md sm:inline dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200",
              {
                "bg-blue-500 dark:bg-blue-500 text-white": currentPage == page,
              },
              { "bg-white dark:bg-gray-800": currentPage != page }
            )}
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
              onClick={() => onClick(page)}
              to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className={classNames(
                "hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform rounded-md sm:inline dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200",
                {
                  "bg-blue-500 dark:bg-blue-500 text-white":
                    currentPage == page,
                },
                { "bg-white dark:bg-gray-800": currentPage != page }
              )}
            >
              ...
            </Link>
          );
        } else if (currentPage > countPages - 5 && page > dot) {
          return (
            <Link
              key={"page-" + page}
              onClick={() => onClick(page)}
              to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className={classNames(
                "hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform rounded-md sm:inline dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200",
                {
                  "bg-blue-500 dark:bg-blue-500 text-white":
                    currentPage == page,
                },
                { "bg-white dark:bg-gray-800": currentPage != page }
              )}
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
              onClick={() => onClick(page)}
              to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className={classNames(
                "hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform rounded-md sm:inline dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200",
                {
                  "bg-blue-500 dark:bg-blue-500 text-white":
                    currentPage == page,
                },
                { "bg-white dark:bg-gray-800": currentPage != page }
              )}
            >
              ...
            </Link>
          );
        }
        if (page > dotleft && page < dotright) {
          return (
            <Link
              key={"page-" + page}
              onClick={() => onClick(page)}
              to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className={classNames(
                "hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform rounded-md sm:inline dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200",
                {
                  "bg-blue-500 dark:bg-blue-500 text-white":
                    currentPage == page,
                },
                { "bg-white dark:bg-gray-800": currentPage != page }
              )}
            >
              {page}
            </Link>
          );
        }
        if (page == countPages) {
          return (
            <Link
              key={"page-" + page}
              onClick={() => onClick(page)}
              to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className={classNames(
                "hidden px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform rounded-md sm:inline dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200",
                {
                  "bg-blue-500 dark:bg-blue-500 text-white":
                    currentPage == page,
                },
                { "bg-white dark:bg-gray-800": currentPage != page }
              )}
            >
              {page}
            </Link>
          );
        }
      }
    }
  });

  return (
    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-600 px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div></div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-x-3">
            <Link
              onClick={() => onClick(currentPage - 1)}
              to={
                "?" +
                qs.stringify(
                  filterNonNull({ ...search, page: currentPage - 1 })
                )
              }
              className={classNames(
                "flex items-center justify-center transition-colors duration-300 transform px-4 py-2 mx-1 text-gray-500 capitalize bg-white rounded-md rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-600 hover:bg-blue-500 dark:hover:bg-blue-500 dark:hover:text-white hover:text-white",
                { "disabled-link": currentPage == 1 }
              )}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            {content}
            <Link
              onClick={() => onClick(currentPage + 1)}
              to={
                "?" +
                qs.stringify(
                  filterNonNull({ ...search, page: currentPage + 1 })
                )
              }
              className={classNames(
                "flex items-center justify-center transition-colors duration-300 transform px-4 py-2 mx-1 text-gray-500 capitalize bg-white rounded-md rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-600 hover:bg-blue-500 dark:hover:bg-blue-500 dark:hover:text-white hover:text-white",
                { "disabled-link": currentPage + 1 > countPages }
              )}
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
