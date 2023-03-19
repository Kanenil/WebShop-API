import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  FunnelIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { useSearchParams } from "react-router-dom";
import qs from "qs";
import { IFilter, IFilterItem, IProductResult, IProductSearch, ISortOption } from "../types";
import http from "../../../http";
import { filterNonNull, ProductPagination } from "./ProductPagination";
import { ProductFiltersMobile } from "./ProductFiltersMobile";
import { SearchItem } from "./SearchItem";
import { ProductSortMenu } from "./ProductSortMenu";
import { ProductFilters } from "./ProductFilters";
import { ProductsList } from "./ProductsList";

const countOnPage = 12;

const ProductsMainPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<IFilter[]>([
    {
      id: "categories",
      name: "Категорія",
      options: [{ value: "", label: "Всі категорії", checked: true }],
    },
  ]);
  const [sortOptions, setSortOptions] = useState<ISortOption[]>([
    { name: "За замовчуванням", href: "", current: true },
    { name: "За алфавітом (A-Z)", href: "nameAscending", current: false },
    { name: "За алфавітом (Z-A)", href: "nameDescending", current: false },
    { name: "За спаданням ціни", href: "priceHighToLow", current: false },
    { name: "За зростанням ціни", href: "priceLowToHigh", current: false },
  ]);

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
    countOnPage: countOnPage,
  });

  const onClickHandler = (page: number) => setSearch({ ...search, page });

  useEffect(() => {
    if (filters[0].options.length == 1) {
      http.get(`/api/categories/mainPage`).then((resp) => {
        let { data } = resp;
        let categories: IFilterItem[] = [];
        data.forEach((element: any) => {
          categories.push({
            value: element!.name as string,
            checked: (element!.name as string) == search.category,
            label: element!.name as string,
          });
        });

        filters[0].options = filters[0].options.concat(categories);
        setFilters(filters);
      });
    }
  }, []);

  useEffect(() => {
    filters[0].options.forEach((item) => {
      if (item.value == search.category) item.checked = true;
      else item.checked = false;
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

    filters[0].options.forEach((item) => {
      if (item.value == search.category) item.checked = true;
      else item.checked = false;
    });

    sortOptions.forEach((opt) => {
      if (opt.href == search.sort) opt.current = true;
      else opt.current = false;
    });
  }, [search]);

  function handleKeyPress(event: any) {
    if (event.key === "Enter" && event.target.value) {
      let newSearch = search.search + " " + event.target.value;
      newSearch = newSearch.trim();
      setSearch({ ...search, search: newSearch });
      setSearchParams(
        "?" + qs.stringify(filterNonNull({ ...search, search: newSearch }))
      );
      event.target.value = "";
    }
  }

  return (
    <>
      <div>
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
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs bg-white flex-col overflow-y-auto py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
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

                  <div className="mt-4 border-t border-gray-200">
                    <ProductFiltersMobile
                      filters={filters}
                      onChange={(option: IFilterItem) => {
                        setSearchParams(
                          "?" +
                            qs.stringify(
                              filterNonNull({
                                ...search,
                                category: option.value,
                              })
                            )
                        );
                        setSearch({
                          ...search,
                          category: option.value,
                        });
                      }}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
            <div>
              {search
                .search!.split(" ")
                .filter((x) => x)
                .map((item) => (
                  <SearchItem
                    search={item}
                    to={
                      "?" +
                      qs.stringify(
                        filterNonNull({
                          ...search,
                          search: search.search?.replace(item, ""),
                        })
                      )
                    }
                    onClick={() =>
                      setSearch({
                        ...search,
                        search: search.search?.replace(item, "").trim(),
                      })
                    }
                  />
                ))}
            </div>

            <div className="flex items-center">
              <ProductSortMenu
                sortOptions={sortOptions}
                onClick={(item: string) => setSearch({ ...search, sort: item })}
                toLink={(item: string) =>
                  "?" +
                  qs.stringify(
                    filterNonNull({
                      ...search,
                      sort: item,
                    })
                  )
                }
              />

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <input
                className="ml-5 shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Пошук"
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <div className="hidden lg:block">
                <ProductFilters
                  filters={filters}
                  onChange={(option: IFilterItem) => {
                    setSearchParams(
                      "?" +
                        qs.stringify(
                          filterNonNull({ ...search, category: option.value })
                        )
                    );
                    setSearch({ ...search, category: option.value });
                  }}
                />
              </div>
              <ProductsList products={data.products} />
            </div>
            <ProductPagination
              countItems={data.total}
              currentPage={data.currentPage}
              countOnPage={countOnPage}
              onClick={onClickHandler}
              search={search}
            />
          </section>
        </main>
      </div>
    </>
  );
};

export default ProductsMainPage;