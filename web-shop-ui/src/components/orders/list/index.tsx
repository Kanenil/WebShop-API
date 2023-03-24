import { HomeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import Pagination from "../../common/pagination";
import { IOrderResponce, IOrderSearch } from "./types";

const OrdersPage = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<IOrderSearch>({
    page: searchParams.get("page") || 1,
    countOnPage: searchParams.get("countOnPage") || 5,
  });
  const [data, setData] = useState<IOrderResponce>({
    pages: 0,
    orders: [],
    total: 0,
    currentPage: 0,
  });

  useEffect(() => {
    http
      .get<IOrderResponce>("/api/orders", {
        params: search,
      })
      .then((resp) => {
        setData(resp.data);
      });
  }, [search]);

  const onPageChange = (page: number) => setSearch({ ...search, page });

  return (
    <section className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8">
      <div className="max-w-xl">
        {data?.orders.length == 0 ? (
          <>
            <div className="text-center">
              <h3 className="mt-2 text-4xl font-medium text-gray-900 dark:text-white">
                Здається тут пусто.
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Ви ще не зробили ні одного замовлення.
              </p>
              <div className="mt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <HomeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Перейти до товарів
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Ваші замовлення
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Тут ви можете перевіряти статус останніх замовлень.
            </p>
          </>
        )}
      </div>

      <div className="mt-12 space-y-16 sm:mt-16">
        {data?.orders.map((order) => (
          <section key={"order-" + order.id}>
            <div className="space-y-1 md:flex md:items-baseline md:space-y-0 md:space-x-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white md:flex-shrink-0">
                Замовлення №{`${order.id}`}
              </h2>
              <div className="space-y-5 md:flex-1 md:min-w-0 sm:flex sm:items-baseline sm:justify-between sm:space-y-0">
                <p className="text-sm font-medium text-gray-500">
                  Статус: {order.orderStatus}
                </p>
                <div className="flex text-sm font-medium">
                  <Link
                    to={`${order.id}`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Детальніше про замовлення
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 -mb-6 flow-root border-t border-gray-200 dark:border-gray-600 divide-y divide-gray-200">
              {order.products.slice(0, 2).map((product) => (
                <div key={"product-" + product.id} className="py-6 sm:flex">
                  <div className="flex space-x-4 sm:min-w-0 sm:flex-1 sm:space-x-6 lg:space-x-8">
                    <img
                      src={`${APP_ENV.IMAGE_PATH}300x300_${product.productImage}`}
                      alt={product.productImage}
                      className="flex-none dark:bg-gray-100 w-16 h-16 rounded-md object-center sm:w-32 sm:h-32 object-contain"
                    />
                    <div className="pt-1.5 min-w-0 flex-1 sm:pt-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        <Link to={`/products/${product.id}`}>
                          {product.productName.length > 26
                            ? product.productName.substring(0, 26) + "..."
                            : product.productName}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        <span>Категорія: {product.categoryName}</span>{" "}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        <span>Кількість: {product.count}</span>
                      </p>
                      <p className="mt-1 font-medium text-gray-900 dark:text-gray-200">
                        {(product.priceBuy * product.count).toLocaleString()} ₴
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4 sm:mt-0 sm:ml-6 sm:flex-none sm:w-40">
                    <Link
                      to={`/products?category=${product.categoryName}`}
                      className="w-full flex items-center justify-center bg-indigo-600 py-2 px-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-full sm:flex-grow-0"
                    >
                      Знайти подібне
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {data.orders.length > 5 && (
        <Pagination
          pages={data.pages}
          currentPage={data.currentPage}
          search={search}
          onClick={onPageChange}
        />
      )}
    </section>
  );
};
export default OrdersPage;
