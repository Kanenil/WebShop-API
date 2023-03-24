import classNames from "classnames";
import qs from "qs";
import { Link } from "react-router-dom";

interface Props {
  pages: number;
  currentPage: number;
  search: any;
  onClick: (page: number) => void;
}

function filterNonNull(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));
}

const Pagination: React.FC<Props> = ({
  pages,
  currentPage,
  onClick,
  search,
}) => {
  const items = Array.from({ length: pages }, (_, i) => i + 1);

  const content = items.map((page) => {
    if (page == 1) {
      return (
        <Link
          key={"page-" + page}
          onClick={() => onClick(page)}
          to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
          className={classNames({
            "px-2 py-1 text-sm": true,
            "text-blue-500 rounded-md bg-blue-100/60 dark:bg-gray-800":
              page == currentPage,
            "text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300":
              page != currentPage,
          })}
        >
          {page}
        </Link>
      );
    }

    if (currentPage <= 5) {
      if ((page != 1 && page <= 7) || (page == pages && pages != 1)) {
        return (
          <Link
            key={"page-" + page}
            onClick={() => onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
            className={classNames({
              "px-2 py-1 text-sm": true,
              "text-blue-500 rounded-md bg-blue-100/60 dark:bg-gray-800":
                page == currentPage,
              "text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300":
                page != currentPage,
            })}
          >
            {page}
          </Link>
        );
      }

      if (page == 8 && pages != page) {
        return (
          <Link
            key={"page-" + page}
            onClick={() => onClick(page)}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
            className={classNames({
              "px-2 py-1 text-sm": true,
              "text-blue-500 rounded-md bg-blue-100/60 dark:bg-gray-800":
                page == currentPage,
              "text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300":
                page != currentPage,
            })}
          >
            ...
          </Link>
        );
      }
    } else if (currentPage > 5) {
      const range = pages - currentPage;

      if (range <= 4) {
        const dot = currentPage - (7 - range);
        if (page == dot) {
          return (
            <Link
              key={"page-" + page}
              onClick={() => onClick(page)}
              to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className={classNames({
                "px-2 py-1 text-sm": true,
                "text-blue-500 rounded-md bg-blue-100/60 dark:bg-gray-800":
                  page == currentPage,
                "text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300":
                  page != currentPage,
              })}
            >
              ...
            </Link>
          );
        } else if (currentPage > pages - 5 && page > dot) {
          return (
            <Link
              key={"page-" + page}
              onClick={() => onClick(page)}
              to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className={classNames({
                "px-2 py-1 text-sm": true,
                "text-blue-500 rounded-md bg-blue-100/60 dark:bg-gray-800":
                  page == currentPage,
                "text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300":
                  page != currentPage,
              })}
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
              className={classNames({
                "px-2 py-1 text-sm": true,
                "text-blue-500 rounded-md bg-blue-100/60 dark:bg-gray-800":
                  page == currentPage,
                "text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300":
                  page != currentPage,
              })}
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
              className={classNames({
                "px-2 py-1 text-sm": true,
                "text-blue-500 rounded-md bg-blue-100/60 dark:bg-gray-800":
                  page == currentPage,
                "text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300":
                  page != currentPage,
              })}
            >
              {page}
            </Link>
          );
        }
        if (page == pages) {
          return (
            <Link
              key={"page-" + page}
              onClick={() => onClick(page)}
              to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              className={classNames({
                "px-2 py-1 text-sm": true,
                "text-blue-500 rounded-md bg-blue-100/60 dark:bg-gray-800":
                  page == currentPage,
                "text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300":
                  page != currentPage,
              })}
            >
              {page}
            </Link>
          );
        }
      }
    }
  });

  return (
    <>
      <div className="flex items-center justify-between mt-6">
        <Link
          to={
            "?" +
            qs.stringify(filterNonNull({ ...search, page: currentPage - 1 }))
          }
          className={classNames(
            "flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800",
            { "disabled-link": currentPage - 1 <= 0 }
          )}
          onClick={() => onClick(currentPage - 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>

          <span>Назад</span>
        </Link>

        <div className="items-center hidden md:flex gap-x-3">{content}</div>

        <Link
          to={
            "?" +
            qs.stringify(filterNonNull({ ...search, page: currentPage + 1 }))
          }
          className={classNames(
            "flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800",
            { "disabled-link": currentPage + 1 > pages }
          )}
          onClick={() => onClick(currentPage + 1)}
        >
          <span>Вперед</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </>
  );
};

export default Pagination;
