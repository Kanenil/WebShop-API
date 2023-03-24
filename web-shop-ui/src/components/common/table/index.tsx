import { ChangeEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import Pagination from "../pagination";
import { DropdownBox, ISelectOption } from "./DropdownBox";
import { HeaderGenerator } from "./HeaderGenerator";
import { ListGenerator } from "./ListGenerator";

interface Props {
  list: any[];
  tableName: string;
  search: any;
  lenght: number;
  pages: number;
  currentPage: number;
  countOnPage?: number | string | null;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onPageChange: (page: number) => void;
  onCountOnPageChange: (page: number) => void;
  onDelete: (id: number) => void;
}

const GenericTable: React.FC<Props> = ({
  list,
  lenght,
  pages,
  currentPage,
  tableName,
  search,
  countOnPage,
  onSearch,
  onPageChange,
  onDelete,
  onClearSearch,
  onCountOnPageChange,
}) => {
  const dropdownOptions: ISelectOption[] = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];

  return (
    <>
      <section className="container px-4 mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-x-3">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">{tableName}</h2>

              <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-gray-600 rounded-full">
                {lenght == 1 && `${lenght} запис`}
                {lenght >= 2 && lenght <= 4  && `${lenght} записи`}
                {(lenght == 0 || lenght > 4) && `${lenght} записів`}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 md:flex md:items-center md:justify-between">
          <Link
            to={"create"}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <span>Добавити</span>
          </Link>

          <div className="flex gap-x-6">
            <DropdownBox onChange={onCountOnPageChange} options={dropdownOptions} seleted={{value: countOnPage!.toString(), label: countOnPage!.toString()}}/>
            <div className="relative flex items-center mt-4 md:mt-0">
              <span className="absolute">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mx-3 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Пошук"
                value={search.search}
                onChange={onSearch}
                className="block w-full py-1.5 pr-5 text-gray-700 bg-white dark:text-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-6">
          {list.length ? (
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-600 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <HeaderGenerator name={list[0]} />
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                      <ListGenerator list={list} onDelete={onDelete} />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center mt-6 text-center border rounded-lg h-96">
              <div className="flex flex-col w-full max-w-sm px-4 mx-auto">
                <div className="p-3 mx-auto text-blue-500 bg-blue-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <h1 className="mt-3 text-lg text-gray-800">
                  Записів не знайдено
                </h1>
                <p className="mt-2 text-gray-500">
                  Ваш пошук “{search.search}” не знайшов ні одного запису.
                  Попробуйте, ще раз або додайте новий запис.
                </p>
                <div className="flex items-center mt-4 sm:mx-auto gap-x-3">
                  <button
                    onClick={onClearSearch}
                    className="w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg sm:w-auto hover:bg-gray-100"
                  >
                    Очистити пошук
                  </button>

                  <Link
                    to="create"
                    className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <span>Добавити</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <Pagination
          pages={pages}
          currentPage={currentPage}
          search={search}
          onClick={onPageChange}
        />
      </section>
    </>
  );
};

export default GenericTable;
