import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import jwt from "jwt-decode";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import citylancscape from "../../../assets/amazing-city-landscape.png";
import http from "../../../http";
import { setCart } from "../../common/basket/CartReducer";
import { IBasketResponce, ICartItem } from "../../common/basket/types";
import { setUser } from "../AuthReducer";
import { IRegisterUser } from "./types";
import { RegisterSchema } from "./validation";

const RegistrtrationPage = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const initValues: IRegisterUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const onSubmitFormik = async (values: IRegisterUser) => {
    try {
      const result = await http.post("/api/auth/register", values);
      const { token } = result.data;

      const decodedToken = jwt(token) as any;
      const expirationDate = new Date(decodedToken.exp * 1000);
      Cookies.set("token", token, { expires: expirationDate });
      http.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const cartFromLocalStorage = localStorage.getItem("cart");
      if (cartFromLocalStorage) {
        let cart = JSON.parse(cartFromLocalStorage) as ICartItem[];

        cart.forEach((item) => {
          http.put("/api/account/basket", {
            productId: item.id,
            count: item.quantity,
          });
        });
      }

      http.get<IBasketResponce>("/api/account/basket").then((resp) => {
        const { data } = resp;
        const list = data.list.map((item) => {
          const cartItem: ICartItem = {
            id: item.product.id,
            name: item.product.name,
            category: item.product.category,
            price: parseFloat(item.product.price),
            image: item.product.images[0],
            quantity: item.count,
            decreasePercent: parseInt(item.product.decreasePercent),
          };
          return cartItem;
        });

        dispatch(setCart(list));
      });

      dispatch(
        setUser({
          isAuth: true,
          name: decodedToken?.name,
          email: decodedToken?.email,
          image: decodedToken?.image,
          roles: decodedToken?.roles,
          emailConfirmed: decodedToken?.emailConfirmed.toLowerCase() === "true",
        })
      );

      navigator("/");
    } catch (error: any) {
      errors.email = "Ця електронна адреса вже використовується!";
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: RegisterSchema,
    onSubmit: onSubmitFormik,
  });

  const { values, errors, touched, handleSubmit, handleChange } = formik;

  return (
    <>
      <section className="flex w-full m-2 max-w-lg mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-7xl">
        <div className="flex justify-center">
          <img
            className="hidden bg-cover lg:block lg:w-2/5"
            src={citylancscape}
          />

          <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
            <div className="w-full">
              <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                Реєстрація.
              </h1>

              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Давайте все налаштуємо, щоб ви могли підтвердити свій особистий
                обліковий запис і розпочати налаштування профілю.
              </p>

              <form
                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Ім'я
                  </label>
                  <input
                    type="text"
                    placeholder="Ім'я"
                    id="firstName"
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    className={classNames(
                      "block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40",
                      {
                        "dark:focus:border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-400 border-red-400":
                          touched.firstName && errors.firstName,
                        "dark:focus:border-green-300 focus:border-green-400 focus:ring-green-300 dark:border-green-400 border-green-400":
                          touched.firstName && !errors.firstName,
                      }
                    )}
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="mt-3 text-xs text-red-400">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Прізвище
                  </label>
                  <input
                    type="text"
                    placeholder="Прізвище"
                    id="lastName"
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    className={classNames(
                      "block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40",
                      {
                        "dark:focus:border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-400 border-red-400":
                          touched.lastName && errors.lastName,
                        "dark:focus:border-green-300 focus:border-green-400 focus:ring-green-300 dark:border-green-400 border-green-400":
                          touched.lastName && !errors.lastName,
                      }
                    )}
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="mt-3 text-xs text-red-400">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2 sm:col-span-1">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Електронна адреса
                  </label>
                  <input
                    type="email"
                    placeholder="example@example.com"
                    id="email"
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    className={classNames(
                      "block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40",
                      {
                        "dark:focus:border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-400 border-red-400":
                          touched.email && errors.email,
                        "dark:focus:border-green-300 focus:border-green-400 focus:ring-green-300 dark:border-green-400 border-green-400":
                          touched.email && !errors.email,
                      }
                    )}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-3 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Пароль
                  </label>
                  <input
                    type="password"
                    placeholder="Введіть ваш пароль"
                    id="password"
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    className={classNames(
                      "block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40",
                      {
                        "dark:focus:border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-400 border-red-400":
                          touched.password && errors.password,
                        "dark:focus:border-green-300 focus:border-green-400 focus:ring-green-300 dark:border-green-400 border-green-400":
                          touched.password && !errors.password,
                      }
                    )}
                  />
                  {touched.password && errors.password && (
                    <p className="mt-3 text-xs text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Підтвердіть пароль
                  </label>
                  <input
                    type="password"
                    placeholder="Підтвердіть ваш пароль"
                    id="confirmPassword"
                    onChange={handleChange}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    className={classNames(
                      "block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40",
                      {
                        "dark:focus:border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-400 border-red-400":
                          touched.confirmPassword && errors.confirmPassword,
                        "dark:focus:border-green-300 focus:border-green-400 focus:ring-green-300 dark:border-green-400 border-green-400":
                          touched.confirmPassword && !errors.confirmPassword,
                      }
                    )}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="mt-3 text-xs text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  <span>Зареєструватися </span>

                  <ArrowRightOnRectangleIcon className="w-5 h-5 rtl:-scale-x-100" />
                </button>
                <Link
                  to="/auth/login"
                  className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                >
                  <span>Увійти </span>

                  <ArrowLeftOnRectangleIcon className="w-5 h-5 rtl:-scale-x-100" />
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegistrtrationPage;
