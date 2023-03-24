import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../http";
import { setCart } from "../../common/basket/CartReducer";
import { ICart } from "../../common/basket/types";
import { Novaposhta } from "./Novaposhta";
import { OrderProductItem } from "./OrderProductItem";
import { ICreateOrder, IDelivery } from "./types";

const OrderSummary = () => {
  const { cart } = useSelector((store: any) => store.shoppingCart as ICart);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const initValues: ICreateOrder = {
    products: cart,
  };

  const onSubmitFormik = async (values: ICreateOrder) => {
    try {
      const result = await http.post("/api/orders", values);

      for (const item of cart) {
        http.delete("/api/account/basket", {
          params: {
            productId: item.id,
          },
        });
      }
      dispatch(setCart([]));

      navigator("/orders");
    } catch (error: any) {
      
    }
  };

  useEffect(() => {
    if(cart.length == 0)
      navigator('/error404');
  }, [cart])
  

  const formik = useFormik({
    initialValues: initValues,
    onSubmit: onSubmitFormik,
  });

  const {handleSubmit} =
    formik;

  const [deliveryInfo, setDeliveryInfo] = useState<IDelivery>({
    area: "",
    city: "",
    warehouse: "",
  });

  return (
    <>
      <div className="flex flex-col items-center border-b dark:border-b-gray-600 bg-gray-80 dark:bg-gray-800 py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Оформлення замовлення
        </h1>
        <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
          <div className="relative">
            <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <Link
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-700"
                  to="/products"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </Link>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Вибір товарів
                </span>
              </li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <Link
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white ring ring-gray-600 ring-offset-2"
                  to=""
                >
                  2
                </Link>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Контактні дані
                </span>
              </li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white"
                  href="#"
                >
                  3
                </a>
                <span className="font-semibold text-gray-500 dark:text-gray-100">
                  Оплата
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium dark:text-white">Замовлення</p>
          <p className="text-gray-400">
            Перевірте вибрані товари та виберіть спосіб доставки.
          </p>
          <div className="mt-8 space-y-3 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-4 sm:px-6">
            {cart.map((product) => (
              <OrderProductItem key={product.id} product={product} />
            ))}
          </div>

          <p className="mt-8 text-lg font-medium dark:text-white">
            Спосіб доставки
          </p>
          <div className="mt-5 grid gap-6">
            <div className="relative">
              <input
                className="peer hidden"
                id="radio_1"
                type="radio"
                name="radio"
                defaultChecked
              />
              <span className="peer-checked:border-gray-700 dark:peer-checked:border-blue-500 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white dark:bg-blue-900"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 dark:peer-checked:bg-gray-600 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                htmlFor="radio_1"
              >
                <img
                  className="w-14 object-contain"
                  src="https://static.novaposhta.ua/sitecard/logo/logochat.png"
                  alt="novaposhta-logo"
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold dark:text-white">
                    Нова пошта
                  </span>
                  <p className="text-slate-500 dark:text-gray-300 text-sm leading-6">
                    Доставка: до 1 тижня
                  </p>
                </div>
              </label>
            </div>
          </div>

          <Novaposhta
            deliveryInfo={deliveryInfo}
            setDeliveryInfo={setDeliveryInfo}
          />
        </div>
        <form onSubmit={handleSubmit} className="mt-10 bg-gray-50 dark:bg-gray-800 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium text-black dark:text-white">
            Оплата
          </p>
          <p className="text-gray-400 mb-6">
            Завершіть замовлення вказавши платіжні реквізити.
          </p>
          <div className="w-full mx-auto rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-800 font-light mb-6">
            <div className="w-full p-3">
              <div className="mb-5 mt-4">
                <label
                  htmlFor="type1"
                  className="flex items-center cursor-pointer"
                >
                  <input
                    defaultChecked
                    type="radio"
                    className="form-radio h-5 w-5 text-indigo-500"
                    name="type"
                    id="type1"
                  />
                  <img
                    src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png"
                    className="h-6 ml-3"
                  />
                </label>
              </div>
              <div>
                <div className="mb-3">
                  <label className="text-gray-600 dark:text-gray-300 font-semibold text-sm mb-2 ml-1">
                    Ім'я
                  </label>
                  <div>
                    <input
                      className="w-full px-3 py-2 mb-1 border border-gray-200 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Іван Іванович"
                      type="text"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="text-gray-600 dark:text-gray-300 font-semibold text-sm mb-2 ml-1">
                    Номер картки
                  </label>
                  <div>
                    <input
                      className="w-full px-3 py-2 mb-1 border border-gray-200 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="0000 0000 0000 0000"
                      type="text"
                    />
                  </div>
                </div>
                <div className="mb-3 -mx-2 flex items-end">
                  <div className="px-2 w-1/4">
                    <label className="text-gray-600 dark:text-gray-300 font-semibold text-sm mb-2 ml-1">
                      Дата завершення
                    </label>
                    <div>
                      <select className="form-select w-full px-3 py-2 mb-1 border border-gray-200 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                        <option value="01">01 - Січень</option>
                        <option value="02">02 - Лютий</option>
                        <option value="03">03 - Березень</option>
                        <option value="04">04 - Квітень</option>
                        <option value="05">05 - Травень</option>
                        <option value="06">06 - Червень</option>
                        <option value="07">07 - Липень</option>
                        <option value="08">08 - Серпень</option>
                        <option value="09">09 - Вересень</option>
                        <option value="10">10 - Жовтень</option>
                        <option value="11">11 - Листопад</option>
                        <option value="12">12 - Грудень</option>
                      </select>
                    </div>
                  </div>
                  <div className="px-2 w-1/4">
                    <select className="form-select w-full px-3 py-2 mb-1 border border-gray-200 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                      <option value="2020">2020</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </div>
                  <div className="px-2 w-1/4">
                    <label className="text-gray-600 dark:text-gray-300 font-semibold text-sm mb-2 ml-1">
                      CVV
                    </label>
                    <div>
                      <input
                        className="w-full px-3 py-2 mb-1 border border-gray-200 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-400 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="000"
                        maxLength={3}
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="mt-4 mb-8 w-full rounded-md bg-gray-900 hover:bg-gray-700 px-6 py-3 font-medium text-white">
            Оформити замовлення
          </button>
        </form>
      </div>
    </>
  );
};
export default OrderSummary;
