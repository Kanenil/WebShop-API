import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_ENV } from "../../env";
import http from "../../http";
import { IProductTableItem } from "../admin/products/types";
import noimage from "../../assets/no-image.webp";
import { Pagination } from "../helpers/Pagination";
import { useLocation } from "react-router-dom";

function validateURL(url: string) {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
    url
  );
}

const countOnPage = 12;

export const ProductsMainPage = () => {
  const [products, setProducts] = useState<Array<IProductTableItem>>([]);
  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const navigator = useNavigate();
  const location = useLocation();

  function handleSearchChange(
    newSearch: string,
    newPage: string,
    newSort: string
  ) {
    setPage(parseInt(newPage));
    setSearch(newSearch);

    http
      .get(`/api/products/count`, {
        params: {
          search: newSearch,
        },
      })
      .then((resp) => {
        setCount(resp.data);
      });

    http
      .get("/api/products", {
        params: {
          page: newPage,
          search: newSearch,
          sort: newSort,
          countOnPage: countOnPage
        },
      })
      .then((resp) => {
        setProducts(resp.data);
      });
  }

  const onChangeSort = (event: any) => {
    const searchParams = new URLSearchParams(location.search);
    const newSearch = searchParams.get("search") || "";
    navigator(
      "/products?page=1" +
        (newSearch ? "&search=" + newSearch : "") +
        (event.target.value ? "&sort=" + event.target.value : "")
    );
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newSearch = searchParams.get("search") || "";
    const newPage = searchParams.get("page") || "1";
    const newSort = searchParams.get("sort") || "";
    handleSearchChange(newSearch, newPage, newSort);
  }, [location.search]);

  return (
    <>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {search ? `"${search}"` : ""}
          </h2>
          <div className="relative">
            <select
              onChange={onChangeSort}
              className="border border-gray-300 rounded-full text-gray-600 h-10 pl-4 pr-8 bg-white hover:border-gray-400 focus:outline-none appearance-none"
            >
              <option value="">За замовчуванням</option>
              <option value="priceLowToHigh">За зростанням ціни</option>
              <option value="priceHighToLow">За спаданням ціни</option>
              <option value="nameAscending">За алфавітом (A-Z)</option>
              <option value="nameDescending">За алфавітом (Z-A)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-5">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="max-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md border-2 border-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80 flex justify-center items-center">
                <img
                  src={
                    product.images
                      ? validateURL(product.images[0])
                        ? product.images[0]
                        : `${APP_ENV.IMAGE_PATH}500x500_${product.images[0]}`
                      : noimage
                  }
                  alt={product.images[0]}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link to={`/products/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name.length > 27
                        ? product.name.substring(0, 27) + "..."
                        : product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.category}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          countItems={count}
          currentPage={page}
          countOnPage={countOnPage}
          url={""}
        />
      </div>
    </>
  );
};
