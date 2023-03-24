import { useEffect, useState } from "react";
import http from "../../http";
import { IProduct } from "../products/types";
import { ProductItem } from "../products/main/ProductItem";
import classNames from "classnames";
import { ICategoryItem } from "../categories/types";
import { Link } from "react-router-dom";
import { APP_ENV } from "../../env";

const MainPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategoryItem[]>([]);
  const [recentlyProducts, setRecentlyProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    if (localStorage.recently != undefined) {
      const items = JSON.parse(localStorage.recently).slice(0, 4);
      for (const item of items) {
        http.get("/api/products/id/" + item.id).then((resp) => {
            setRecentlyProducts([...items.filter((item: any)=>item.id !== resp.data.id), resp.data]);
        });
      }
    }
  }, [localStorage.recently]);

  useEffect(() => {
    http
      .get("/api/products/most-buys", {
        params: {
          count: 4,
        },
      })
      .then((resp) => {
        setProducts(resp.data);
      });
    http
      .get("/api/categories/mainPage", {
        params: {
          count: 5,
        },
      })
      .then((resp) => {
        setCategories(resp.data);
      });
  }, []);
  

  return (
    <>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        {recentlyProducts.length > 0 && (
          <>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
              Ви нещодавно переглядали
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {recentlyProducts.map((product) => (
                <ProductItem key={"recently-" + product.id} product={product} />
              ))}
            </div>
          </>
        )}

        <h2
          className={classNames(
            "text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200",
            { "mt-6": recentlyProducts.length > 0 }
          )}
        >
          Популярне серед покупців
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>

        <div className="px-4 mt-6 sm:px-6 sm:flex sm:items-center sm:justify-between lg:px-8 xl:px-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">Категорії</h2>
          <Link to="/categories" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
            Показати всі категорії<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="mt-4 flow-root">
          <div className="">
            <div className="box-content py-2 relative max-h-60 h-56 overflow-x-auto xl:overflow-visible">
              <div className="absolute min-w-screen-xl px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-x-8">
                {categories.slice(0, 5).map((category) => (
                  <Link
                    key={category.name}
                    to={`/products?category=${category.name}`}
                    className="relative w-56 max-h-60 h-56 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                  >
                    <span aria-hidden="true" className="absolute inset-0">
                      <img src={`${APP_ENV.IMAGE_PATH}500x500_${category.image}`} alt={category.image} className="w-full h-full object-center object-cointain" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                    />
                    <span className="relative mt-auto text-center text-xl font-bold text-white">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4 sm:hidden">
          <a href="#" className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Browse all categories<span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </>
  );
};
export default MainPage;
