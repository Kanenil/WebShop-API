import { useEffect, useState } from "react";
import http from "../../http";
import { IProduct } from "../products/types";
import { ProductItem } from "../products/main/ProductItem";


export const MainPage = () => {
  const [products, setProducts] = useState<Array<IProduct>>([]);

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
  }, []);

  return (
    <>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
          Популярне серед покупців
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductItem key={product.id} product={product}/>
          ))}
        </div>
      </div>
    </>
  );
};
