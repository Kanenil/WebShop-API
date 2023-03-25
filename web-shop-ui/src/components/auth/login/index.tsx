import citylancscape from "../../../assets/city-landscape.png";
import { GoogleAuth } from "./GoogleAuth";
import logo from "../../../logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { ILoginUser } from "./types";
import http from "../../../http";
import { useFormik } from "formik";
import { LoginSchema } from "./validation";
import classNames from "classnames";
import { IBasketResponce, ICartItem } from "../../common/basket/types";
import Cookies from "js-cookie";
import jwt from "jwt-decode";
import { setCart } from "../../common/basket/CartReducer";
import { setUser } from "../AuthReducer";
import { useDispatch, useSelector } from "react-redux";
import { IAuthUser } from "../types";
import { useEffect, useState } from "react";
import Alert from "../../common/alert";

const LoginPage = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const { isAuth } = useSelector(
    (store: any) => store.auth as IAuthUser
  );

  useEffect(() => {
    if(isAuth) 
      navigator('/profile');
  }, [])
  

  const initValues: ILoginUser = {
    email: "",
    password: "",
  };

  const onSubmitFormik = async (values: ILoginUser) => {
    try {
      const result = await http.post("/api/auth/login", values);
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
      errors.email = error.response.data;
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: LoginSchema,
    onSubmit: onSubmitFormik,
  });

  const { values, errors, touched, handleSubmit, handleChange } = formik;

  return (
    <>
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
        <img
          className="hidden bg-cover lg:block lg:w-1/2"
          src={citylancscape}
        />

        <form
          className="w-full px-6 py-8 md:px-8 lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <Alert
            text={alertMessage}
            type={"danger"}
            open={alertOpen}
            setOpen={setAlertOpen}
          />

          <div className="flex justify-center mx-auto">
            <img className="w-auto h-16" src={logo} alt="" />
          </div>

          <GoogleAuth
            onErrorLogin={(message) => {
              setAlertMessage(message);
              setAlertOpen(true);
            }}
          />

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

            <Link
              to=""
              className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
            >
              або через email
            </Link>

            <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
          </div>

          <div className="mt-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
              htmlFor="email"
            >
              Електронна Пошта
            </label>
            <input
              id="email"
              onChange={handleChange}
              value={values.email}
              name="email"
              className={classNames(
                "block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300",
                {
                  "dark:focus:border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-400 border-red-400":
                    touched.email && errors.email,
                  "dark:focus:border-green-300 focus:border-green-400 focus:ring-green-300 dark:border-green-400 border-green-400":
                    touched.email && !errors.email,
                }
              )}
              type="email"
            />
            {touched.email && errors.email && (
              <p className="mt-3 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="mt-4">
            <div className="flex justify-between">
              <label
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                htmlFor="password"
              >
                Пароль
              </label>
              <Link
                to="/auth/forgotpassword"
                className="text-xs text-gray-500 dark:text-gray-300 hover:underline"
              >
                Забули пароль?
              </Link>
            </div>

            <input
              id="password"
              onChange={handleChange}
              value={values.password}
              name="password"
              className={classNames(
                "block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300",
                {
                  "dark:focus:border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-400 border-red-400":
                    touched.password && errors.password,
                  "dark:focus:border-green-300 focus:border-green-400 focus:ring-green-300 dark:border-green-400 border-green-400":
                    touched.password && !errors.password,
                }
              )}
              type="password"
            />
            {touched.password && errors.password && (
              <p className="mt-3 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            >
              Увійти
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

            <Link
              to="/auth/register"
              className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
            >
              або зареєструватися
            </Link>

            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
          </div>
        </form>
      </div>
    </>
  );
};
export default LoginPage;
