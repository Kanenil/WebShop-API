import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import Pagination from "../../common/pagination";
import { IOrderSearch } from "../../orders/list/types";
import { ITableOrderResponce } from "./types";
import usericon from "../../../assets/user.jpg";
import classNames from "classnames";
import OrderView from "./OrderView";


function validateURL(url: string) {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
    url
  );
}

const OrdersList = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<IOrderSearch>({
    page: searchParams.get("page") || 1,
    countOnPage: searchParams.get("countOnPage") || 10,
  });
  const [data, setData] = useState<ITableOrderResponce>({
    pages: 0,
    orders: [],
    total: 0,
    currentPage: 0,
  });

  useEffect(() => {
    http
      .get<ITableOrderResponce>("/api/orders/all", {
        params: search,
      })
      .then((resp) => {
        setData(resp.data);
      });
  }, [search]);

  const onPageChange = (page: number) => setSearch({ ...search, page });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Замовлення
          </h1>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                    >
                      Номер замовлення
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                    >
                      Ім'я
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Статус
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Кількість товарів
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {data.orders.map((order) => (
                    <tr key={"col-" + order.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="text-gray-900 dark:text-white">
                          Замовлення №{order.id}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={
                                order.image
                                  ? validateURL(order.image)
                                    ? order.image
                                    : `${APP_ENV.IMAGE_PATH}100x100_${order.image}`
                                  : usericon
                              }
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {order.name}
                            </div>
                            <div className="text-gray-500">{order.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={classNames(
                            "inline-flex rounded-ful px-2 text-xs font-semibold leading-5",
                            {
                              "bg-green-100 text-green-800":
                                order.orderStatus ===
                                "Знаходиться в місті отримувача",
                            },
                            {
                              "bg-red-100 text-red-800":
                                order.orderStatus === "Скасовано",
                            },
                            {
                              "bg-blue-100 text-blue-800":
                                order.orderStatus !== "Скасовано" &&
                                order.orderStatus !==
                                  "Знаходиться в місті отримувача",
                            }
                          )}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-200">
                        {order.products.length}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <OrderView
                          order={order}
                          onSubmit={() => {
                            setSearch({ ...search, page: 1 });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        pages={data.pages}
        currentPage={data.currentPage}
        search={search}
        onClick={onPageChange}
      />
    </div>
  );
};

export default OrdersList;
