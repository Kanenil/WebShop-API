import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import qs from "qs";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import http from "../../../http";
import { FilterChips } from "./FilterChips";
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
