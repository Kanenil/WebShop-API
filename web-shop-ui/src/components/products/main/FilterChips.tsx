import { XMarkIcon } from "@heroicons/react/24/outline";
import qs from "qs";
import { Link } from "react-router-dom";
import { IProductSearch } from "../types";
import { filterNonNull } from "./types";

interface Props {
  search: IProductSearch;
  setSearch: (search: IProductSearch) => void;
}

export const FilterChips: React.FC<Props> = ({ search, setSearch }) => {
  const searchArr = search.search?.split(" ").filter((x) => x);
  const uniqueArr = searchArr?.filter((element, index) => {
    return searchArr.indexOf(element) === index;
  });
  return (
    <>
      {(search.category || search.search) && (
        <Link
          to={
            "?" +
            qs.stringify(filterNonNull({ ...search, category: "", search: "", page: 1 }))
          }
          onClick={() => {
            setSearch({ ...search, category: "", search: "", page: 1 });
          }}
          className="border-red-300 hover:text-white hover:bg-red-300 dark:border-red-500 dark:hover:bg-red-500 dark:text-gray-300 border transition-all duration-300 ease-in-out rounded-full py-1 px-4"
        >
          Скасувати
        </Link>
      )}
      {search.category && (
        <Link
          to={"?" + qs.stringify(filterNonNull({ ...search, category: "", page: 1 }))}
          onClick={() => {
            setSearch({ ...search, category: "", page: 1 });
          }}
          className="flex border-gray-300 hover:bg-gray-200 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-600 border transition-all duration-300 ease-in-out rounded-full py-1 pl-4"
        >
          {search.category}
          <XMarkIcon className="w-6 h-6 p-1 mx-1 text-red-400" />
        </Link>
      )}
      {uniqueArr?.map((item) => (
        <Link
          key={item}
          to={
            "?" +
            qs.stringify(
              filterNonNull({
                ...search,
                search: search.search?.replace(item, ""),
                page: 1
              })
            )
          }
          onClick={() => {
            setSearch({
              ...search,
              search: search.search?.replace(item, "").trim(),
              page: 1
            });
          }}
          className="flex border-gray-300 hover:bg-gray-200 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-600 border transition-all duration-300 ease-in-out rounded-full py-1 pl-4"
        >
          {item}
          <XMarkIcon className="w-6 h-6 p-1 mx-1 text-red-400" />
        </Link>
      ))}
    </>
  );
};
