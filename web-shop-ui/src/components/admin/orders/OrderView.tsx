import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { IOrderStatus, ITableOrder } from "./types";
import http from "../../../http";
import { useFormik } from "formik";
import { SelectField } from "../../common/inputs/SelectField";
import { APP_ENV } from "../../../env";
import { Link } from "react-router-dom";
import Alert from "../../common/alert";
import usericon from "../../../assets/user.jpg";
function validateURL(url: string) {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
    url
  );
}

interface Props {
  order: ITableOrder;
  onSubmit: () => void;
}

const OrderView: React.FC<Props> = ({ order, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [orderStatuses, setOrderStatuses] = useState<IOrderStatus[]>([]);

  useEffect(() => {
    http.get<string[]>("/api/orders/statuses").then((resp) => {
      setOrderStatuses(
        resp.data.map((item) => {
          return { name: item, id: 0, email: "" };
        })
      );
    });
  }, []);

  const initValues: IOrderStatus = {
    name: order.orderStatus,
    id: order.id,
    email: order.email,
  };

  const onSubmitFormik = async (values: IOrderStatus) => {
    try {
      const result = await http.put("/api/orders", values);

      onSubmit();
      setAlertOpen(true);
    } catch (error: any) {}
  };

  const formik = useFormik({
    initialValues: initValues,
    onSubmit: onSubmitFormik,
  });

  const { values, handleSubmit, handleChange } = formik;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="text-indigo-600 hover:text-indigo-900"
      >
        Детальніше
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div
            className="flex min-h-screen text-center md:block md:px-2 lg:px-4"
            style={{ fontSize: 0 }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden md:inline-block md:align-middle md:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <div className="flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
                <div className="w-full relative flex items-center bg-white dark:bg-gray-900 px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="w-full grid grid-cols-1 gap-y-8 gap-x-6 items-start sm:grid-cols-12 lg:items-center lg:gap-x-8">
                    <div className="sm:col-span-8 lg:col-span-5">
                      <Alert
                        text={"Успішно збережено!"}
                        type={"success"}
                        open={alertOpen}
                        setOpen={setAlertOpen}
                      />
                      <h2 className="text-xl font-medium text-gray-900 dark:text-white sm:pr-12">
                        Замовлення №{order.id}
                      </h2>

                      <div className="flex items-center mt-2">
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

                      <section className="mt-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          На суму:{" "}
                          {order.products
                            .reduce(
                              (acc, item) => acc + item.priceBuy * item.count,
                              0
                            )
                            .toLocaleString()}{" "}
                          ₴
                        </p>
                      </section>

                      <section className="mt-8">
                        <form onSubmit={handleSubmit}>
                          <SelectField
                            label={"Статус"}
                            value={values.name}
                            field={"name"}
                            items={orderStatuses.map((item) => {
                              return {
                                label: item.name,
                                value: item.name,
                              };
                            })}
                            onChange={handleChange}
                          />

                          <button
                            type="submit"
                            className="mt-8 w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Зберегти
                          </button>
                        </form>
                      </section>
                    </div>
                    <div className="col-span-7">
                      <h2 className="text-xl font-medium text-gray-900 dark:text-white sm:pr-12">
                        Товари
                      </h2>
                      {order.products.map((product) => (
                        <div
                          key={product.id}
                          className="py-3 border-b border-gray-200 dark:border-gray-600 flex space-x-6"
                        >
                          <img
                            src={`${APP_ENV.IMAGE_PATH}300x300_${product.productImage}`}
                            alt={product.productImage}
                            className="flex-none w-20 h-20 object-center bg-gray-100 rounded-lg sm:w-28 sm:h-28 object-contain"
                          />
                          <div className="flex-auto flex flex-col">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-300">
                                <Link to={`/products/${product.id}`}>
                                  {product.productName.length > 15
                                    ? product.productName.substring(0, 15) +
                                      "..."
                                    : product.productName}
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
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default OrderView;
