import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_ENV } from "../../env";
import http from "../../http";
import { IProductTableItem } from "../admin/products/types";
import noimage from "../../assets/no-image.webp";
import { Pagination } from "../helpers/Pagination";
import { useLocation } from "react-router-dom";
import { TagIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
  const [search, setSearch] = useState<string[]>([]);

  const navigator = useNavigate();
  const location = useLocation();

  function handleSearchChange(
    newSearch: string,
    newPage: string,
    newSort: string
  ) {
    setPage(parseInt(newPage));

    const outputArray = [];

    let remainingString = newSearch.trim();

    while (remainingString.length > 0) {
      const categoryRegex = /Категорія:"([^"]+)"/;
      const categoryMatch = remainingString.match(categoryRegex);

      if (categoryMatch) {
        outputArray.push(categoryMatch[0]);
        remainingString = remainingString.replace(categoryRegex, "");
      } else {
        const remainingWords = remainingString.trim().split(/\s+/);

        for (let word of remainingWords) {
          outputArray.push(word);
        }

        remainingString = "";
      }
    }

    setSearch(outputArray);

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
          countOnPage: countOnPage,
        },
      })
      .then((resp) => {
        setProducts(resp.data);
      });
  }

  function handleKeyPress(event: any) {
    if (event.key === "Enter" && event.target.value) {
      navigator(
        "/products?page=1" +
          (event.target.value
            ? "&search=" +
              search.toString().replace(",", " ") +
              ` ${event.target.value}`
            : "")
      );
      event.target.value = "";
    }
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
        {search.length > 0 &&
          search.map((item) => {
            const searchFilter = search
              .filter((searchItem) => searchItem != item)
              .toString()
              .replace(",", " ");
            return (
              <span
                key={item}
                className="mr-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                <TagIcon className="flex-shrink-0 -ml-0.5 mr-1.5 h-4 w-4 text-gray-400" />
                {item}
                <Link
                  to={
                    "/products?page=1" +
                    (searchFilter && `&search=${searchFilter}`)
                  }
                >
                  <XMarkIcon className="flex-shrink-0 ml-0.5 mr-1.5 h-4 w-4 text-gray-800" />
                </Link>
              </span>
            );
          })}
        <div className="flex justify-between">
          <div className="leading-7">
            <select
              onChange={onChangeSort}
              className="mt-3 border border-gray-300 rounded-full text-gray-600 h-10 pl-4 pr-8 bg-white hover:border-gray-400 focus:outline-none appearance-none"
            >
              <option value="">За замовчуванням</option>
              <option value="priceLowToHigh">За зростанням ціни</option>
              <option value="priceHighToLow">За спаданням ціни</option>
              <option value="nameAscending">За алфавітом (A-Z)</option>
              <option value="nameDescending">За алфавітом (Z-A)</option>
            </select>
          </div>

          <div className="relative">
            <input
              className="shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Пошук"
              onKeyPress={handleKeyPress}
            />
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
                  {product.price.toLocaleString()} ₴
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
