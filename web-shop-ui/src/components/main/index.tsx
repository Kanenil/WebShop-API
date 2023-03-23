import { useEffect, useState } from "react";
import http from "../../http";
import { IProduct } from "../products/types";
import { ProductItem } from "../products/main/ProductItem";
import classNames from "classnames";

const MainPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [recentlyProducts, setRecentlyProducts] = useState<IProduct[]>([]);

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
    if (localStorage.recently != undefined) {
      const items = JSON.parse(localStorage.recently).slice(0, 4);
      for (const item of items) {
        http.get("/api/products/id/" + item.id).then((resp) => {
            setRecentlyProducts([...items.filter((item: any)=>item.id !== resp.data.id), resp.data]);
        });
      }
    }
  }, [localStorage.recently]);

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
      </div>
    </>
  );
};
export default MainPage;
