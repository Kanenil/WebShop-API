import { ChangeEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import qs from "qs";
import { IProductResult, IProductSearch } from "../../../products/types";
import http from "../../../../http";
import {
  filterNonNull,
  ProductPagination,
} from "../../../products/list/ProductPagination";
import { ProductTable } from "./ProductTable";

const countOnPage = 10;

const ProductsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<IProductSearch>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    page: searchParams.get("page") || 1,
    sort: searchParams.get("sort") || "",
    countOnPage: countOnPage,
  });
  const [data, setData] = useState<IProductResult>({
    pages: 0,
    products: [],
    total: 0,
    currentPage: 0,
  });

  useEffect(() => {
    http
      .get<IProductResult>("/api/products", {
        params: search,
      })
      .then((resp) => {
        setData(resp.data);
      });
  }, [search]);

  const deleteHandler = (id: number) => {
    http.delete("/api/products/" + id).then((resp) => {
      setSearch({ ...search, search: search.search });
    });
  };

  const onClickHandler = (page: number) => setSearch({ ...search, page });

  const OnSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch({ ...search, search: value });
    setSearchParams(
      "?" + qs.stringify(filterNonNull({ ...search, search: value }))
    );
  };

  return (
    <>
      <div className="flex justify-between items-center py-4 px-6 bg-gray-100">
        <Link
          to="create"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Додати
        </Link>
        <div className="flex items-center">
          <input
            onChange={OnSearchHandler}
            type="text"
            className="border-2 leading-tight border-gray-400 rounded px-4 py-2"
            placeholder="Пошук..."
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Назва
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Категорія
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ціна
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Фотографія
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                  </tr>
                </thead>
                <ProductTable
                  products={data.products}
                  onDelete={deleteHandler}
                />
              </table>
            </div>
          </div>
        </div>
        <ProductPagination
          countItems={data.total}
          currentPage={data.currentPage}
          countOnPage={countOnPage}
          search={search}
          onClick={onClickHandler}
        />
      </div>
    </>
  );
};

export default ProductsListPage;
