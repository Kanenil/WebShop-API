import { Dialog, Transition } from "@headlessui/react";
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import qs from "qs";
import { Fragment, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import http from "../../../http";
import { FilterChips } from "./FilterChips";
import { MobileFilters } from "./MobileFilters";
import { ProductFilter } from "./ProductFilter";
import { ProductsList } from "./ProductList";
import { ProductPagination } from "./ProductPagination";
import { SortMenu } from "./SortMenu";
import {
  filterNonNull,
  IProductFilter,
  IProductResult,
  IProductSearch,
} from "./types";

const ProductsMainPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<IProductFilter[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<IProductResult>({
    pages: 0,
    products: [],
    total: 0,
    currentPage: 0,
  });
  const [search, setSearch] = useState<IProductSearch>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    page: searchParams.get("page") || 1,
    sort: searchParams.get("sort") || "",
    countOnPage: 12,
  });

  const onChangeCategory = (category: string) => {
    setSearch({ ...search, category });
    setSearchParams("?" + qs.stringify(filterNonNull({ ...search, category })));
  };

  const onChangeSort = (sort: string) => {
    setSearch({ ...search, sort });
    setSearchParams("?" + qs.stringify(filterNonNull({ ...search, sort })));
  };

  const handleKeyPress = (event: any) => {
    const { value } = event.target;
    if (event.key === "Enter" && value) {
      if (
        !search.search
          ?.split(" ")
          .filter((x) => x)
          .includes(value)
      ) {
        let newSearch = search.search + " " + value;
        newSearch = newSearch.trim();
        setSearch({ ...search, search: newSearch });
        setSearchParams(
          "?" + qs.stringify(filterNonNull({ ...search, search: newSearch }))
        );
      }
      event.target.value = "";
    }
  };

  const onClickHandler = (page: number) => setSearch({ ...search, page });

  useEffect(() => {
    http.get(`/api/categories/mainPage`).then((resp) => {
      let { data } = resp;
      let categories: IProductFilter = {
        label: "Категорія",
        items: [],
      };
      data.forEach((element: any) => {
        categories.items.push({
          label: element!.name as string,
          value: (element!.name as string) == search.category,
        });
      });
      setFilters([categories]);
    });
  }, [search.category]);

  useEffect(() => {
    http
      .get<IProductResult>("/api/products", {
        params: search,
      })
      .then((resp) => {
        setData(resp.data);
      });
  }, [search]);

  return (
    <>
      <div className="mx-auto max-w-7xl">
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs bg-white dark:bg-gray-800 flex-col overflow-y-auto py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                      Фільтри
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-4 border-t border-gray-200 dark:border-gray-600">
                    <MobileFilters
                      filters={filters}
                      setFilters={setFilters}
                      onChange={onChangeCategory}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-600 pt-24 pb-6">
          <div className="flex gap-x-3 justify-center">
            <h1 className="m-auto text-gray-800 dark:text-white font-medium">
              Обрано{" "}
              {data.total == 0 || data.total >= 5
                ? `${data.total} товарів`
                : data.total == 1
                ? `${data.total} товар`
                : `${data.total} товари`}
            </h1>

            <FilterChips search={search} setSearch={setSearch} />
          </div>

          <div className="flex items-center gap-x-6">
            <SortMenu current={search.sort} onChange={onChangeSort} />

            <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </span>

              <input
                type="text"
                onKeyPress={handleKeyPress}
                className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                placeholder="Пошук"
              />
            </div>
          </div>
        </div>
        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <div className="hidden lg:block">
              <ProductFilter
                filters={filters}
                setFilters={setFilters}
                onChange={onChangeCategory}
              />
            </div>
            <ProductsList products={data.products} />
          </div>
          <ProductPagination
            countItems={data.total}
            currentPage={data.currentPage}
            countOnPage={12}
            onClick={onClickHandler}
            search={search}
          />
        </section>
      </div>
    </>
  );
};
export default ProductsMainPage;
