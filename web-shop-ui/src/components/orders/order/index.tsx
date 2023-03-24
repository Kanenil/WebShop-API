import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import { IOrderItem } from "../list/types";

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<IOrderItem>({
    orderStatus: "Скасовано",
    id: 0,
    products: [],
  });

  useEffect(() => {
    http
      .get("/api/orders/" + id)
      .then((resp) => {
        setState(resp.data);
      })
      .catch((error) => {
        navigate("/error404");
      });
  }, []);

  const onCancelClick = () => {
    http.delete('/api/orders/cancel/'+id).then(resp=>{
        setState({...state, orderStatus: "Скасовано"});
    })
  }

  return (
    <>
      <main className="bg-white dark:bg-gray-800 px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="max-w-xl">
            <h1 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Дякуємо!
            </h1>
            <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl dark:text-gray-200">
              Замовлення №{state.id}
            </p>
            <p className="mt-2 text-base text-gray-500">
              Ваше замволення #{state.id} зараз під статусом:{" "}
              {state.orderStatus}.
            </p>
          </div>

          {state.orderStatus.toLowerCase() !=
            "знаходиться в місті отримувача" &&
            state.orderStatus.toLowerCase() != "скасовано" && (
              <button
                type="button"
                onClick={onCancelClick}
                className="max-w-xs mt-5 flex items-center justify-center bg-red-700 py-2 px-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-full sm:flex-grow-0"
              >
                Скасувати замовлення
              </button>
            )}

          <section className="mt-10 border-t border-gray-200 dark:border-gray-600">
            <h2 className="sr-only">Your order</h2>

            <h3 className="sr-only">Items</h3>
            {state.products.map((product) => (
              <div
                key={product.id}
                className="py-10 border-b border-gray-200 dark:border-gray-600 flex space-x-6"
              >
                <img
                  src={`${APP_ENV.IMAGE_PATH}300x300_${product.productImage}`}
                  alt={product.productImage}
                  className="flex-none w-20 h-20 object-center bg-gray-100 rounded-lg sm:w-40 sm:h-40 object-contain"
                />
                <div className="flex-auto flex flex-col">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-300">
                      <Link to={`/products/${product.id}`}>
                        {product.productName}
                      </Link>
                    </h4>
                    <Link
                      to={`/products?category=${product.categoryName}`}
                      className="text-sm text-gray-600 dark:text-gray-500"
                    >
                      {product.categoryName}
                    </Link>
                  </div>
                  <div className="mt-6 flex-1 flex items-end">
                    <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                      <div className="flex">
                        <dt className="font-medium text-gray-900 dark:text-gray-400">
                          Кількість
                        </dt>
                        <dd className="ml-2 text-gray-700 dark:text-gray-300">
                          {product.count}
                        </dd>
                      </div>
                      <div className="pl-4 flex sm:pl-6">
                        <dt className="font-medium text-gray-900 dark:text-gray-400">
                          Ціна за шт.
                        </dt>
                        <dd className="ml-2 text-gray-700 dark:text-gray-300">
                          {product.priceBuy.toLocaleString()} ₴
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ))}

            <div className="sm:ml-40 sm:pl-6">
              <h3 className="sr-only">Summary</h3>

              <dl className="space-y-6 text-sm pt-10">
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-900 dark:text-white">
                    Загалом
                  </dt>
                  <dd className="text-gray-700 dark:text-gray-200">
                    {state.products
                      .reduce(
                        (acc, item) => acc + item.priceBuy * item.count,
                        0
                      )
                      .toLocaleString()}{" "}
                    ₴
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
export default OrderPage;
