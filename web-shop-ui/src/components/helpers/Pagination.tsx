import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setCurrentPage } from "./PaginationReducer";
import { IPaginationInfo } from "./types";

export const Pagination = ({
  countItems,
  countOnPage,
  url,
  currentPage,
  onPageChange
}: IPaginationInfo) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const countPages = Math.ceil(countItems / countOnPage);
  const items = Array.from({ length: countPages }, (_, i) => i + 1);

  const prevParams = new URLSearchParams(location.search);
  const nextParams = new URLSearchParams(location.search);

  prevParams.set("page", (currentPage - 1).toString());
  nextParams.set("page", (currentPage + 1).toString());
  const prevUrl = `${url}?${prevParams.toString()}`;
  const nextUrl = `${url}?${nextParams.toString()}`;

  const showed = countItems > 0 ? (currentPage - 1) * countOnPage + 1 : 0;

  const content = items.map((page) => {
    const search = new URLSearchParams(location.search);
    search.set("page", page.toString());
    const seacrhURL = `${url}?${search.toString()}`;

    if (page == 1) {
      return currentPage == page ? (
        <Link
          key={"page-" + page}
          to={seacrhURL}
          onClick={() => onPageChange(page)}
          aria-current={currentPage == page ? "page" : undefined}
          className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {page}
        </Link>
      ) : (
        <Link
          key={"page-" + page}
          to={seacrhURL}
          onClick={() => onPageChange(page)}
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
            to={seacrhURL}
            onClick={() => onPageChange(page)}
            aria-current={currentPage == page ? "page" : undefined}
            className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {page}
          </Link>
        ) : (
          <Link
            key={"page-" + page}
            to={seacrhURL}
            onClick={() => onPageChange(page)}
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
            onClick={() => onPageChange(page)}
            to={seacrhURL}
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
              onClick={() => onPageChange(page)}
              to={seacrhURL}
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              ...
            </Link>
          );
        } else if (currentPage > countPages - 5 && page > dot) {
          return currentPage == page ? (
            <Link
              key={"page-" + page}
              to={seacrhURL}
              onClick={() => onPageChange(page)}
              aria-current={currentPage == page ? "page" : undefined}
              className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {page}
            </Link>
          ) : (
            <Link
              key={"page-" + page}
              to={seacrhURL}
              onClick={() => onPageChange(page)}
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
              onClick={() => onPageChange(page)}
              to={seacrhURL}
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
              to={seacrhURL}
              onClick={() => onPageChange(page)}
              aria-current={currentPage == page ? "page" : undefined}
              className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {page}
            </Link>
          ) : (
            <Link
              key={"page-" + page}
              to={seacrhURL}
              onClick={() => onPageChange(page)}
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
              to={seacrhURL}
              aria-current={currentPage == page ? "page" : undefined}
              onClick={() => onPageChange(page)}
              className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {page}
            </Link>
          ) : (
            <Link
              key={"page-" + page}
              to={seacrhURL}
              onClick={() => onPageChange(page)}
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
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Показано <span className="font-medium">{showed}</span> до{" "}
            <span className="font-medium">
              {showed + countOnPage - 1 < countItems
                ? showed + countOnPage - 1
                : countItems}
            </span>{" "}
            з <span className="font-medium">{countItems}</span> результатів
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <Link
              to={prevUrl}
              onClick={() => onPageChange(currentPage - 1)}
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
              to={nextUrl}
              onClick={() => onPageChange(currentPage + 1)}
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
