import { LinkIcon } from "@heroicons/react/20/solid";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../http";
import logo from "../../../logo.svg";
import { GoogleAuth } from "../login/GoogleAuth";
import { AuthActionType } from "../types";
import { IRegisterUser } from "./types";
import Cookies from "js-cookie";
import jwt from "jwt-decode";
import { setUser } from "../AuthReducer";
import { IBasketResponce, ICartItem } from "../../common/basket/types";
import { setCart } from "../../common/basket/CartReducer";

export const RegisterPage = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState<IRegisterUser>({
    firstName:"",
    lastName:"",
    email: "",
    password: "",
    confirmPassword:"",
  });

  useEffect(() => {
    if (Cookies.get("token") != undefined) navigator("/error404");
  }, [])

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(state.email && state.password && state.firstName && state.lastName && state.password === state.confirmPassword)
    {
        http
        .post("/api/auth/register", state)
        .then((resp) => {
          const { token } = resp.data;
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
          console.log(list);
          
          dispatch(
            setCart(list)
          );
        });

          dispatch(
            setUser({
              isAuth: true,
              name: decodedToken?.name,
              email: decodedToken?.email,
              image: decodedToken?.image,
              roles: decodedToken?.roles,
              emailConfirmed:
                decodedToken?.emailConfirmed.toLowerCase() === "true",
            })
          );
          navigator("/");
        });
        
    }
  }

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          <div>
            <img className="mx-auto h-12 w-auto" src={logo} alt="logo" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Реєстрація
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSubmitHandler}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="firstname" className="sr-only">
                    Ім'я
                  </label>
                  <input
                    id="firstname"
                    name="firstName"
                    onChange={onChangeHandler}
                    value={state.firstName}
                    type="text"
                    autoComplete="firstname"
                    required
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Ім'я"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="lastname" className="sr-only">
                    Прізвище
                  </label>
                  <input
                    id="lastname"
                    name="lastName"
                    onChange={onChangeHandler}
                    value={state.lastName}
                    type="text"
                    autoComplete="lastname"
                    required
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Прізвище"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="email-address" className="sr-only">
                    Електронна пошта
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    onChange={onChangeHandler}
                    value={state.email}
                    autoComplete="email"
                    required
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Електронна пошта"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="password" className="sr-only">
                    Пароль
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={onChangeHandler}
                    value={state.password}
                    autoComplete="current-password"
                    required
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Пароль"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="confirmPassword" className="sr-only">
                    Підтвердити Пароль
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={onChangeHandler}
                    value={state.confirmPassword}
                    type="password"
                    autoComplete="confirm-password"
                    required
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Підтвердити Пароль"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center max-w-md">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Я погоджуюсь з{" "}
                  <Link
                    to="/terms"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    умовами положення про обробку і захист персональних даних та
                    угодою користувача
                  </Link>
                </label>
              </div>

              <div className="text-sm mt-3 ml-2 md:mt-0">
                <Link
                  to="/auth/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Увійти в аккаунт
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LinkIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Зареєструватися
              </button>
            </div>

            <hr className="h-px my-8 bg-indigo-200 border-0 dark:bg-indigo-700" />

            <div className="flex justify-center">
              <GoogleAuth />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
