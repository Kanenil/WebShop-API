import {
    MoonIcon,
    ShoppingCartIcon,
    SunIcon,
  } from "@heroicons/react/24/outline";
  import classNames from "classnames";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { Link, useNavigate } from "react-router-dom";
  import { APP_ENV } from "../../../../env";
  import logo from "../../../../logo.svg";
  import usericon from "../../../../assets/user.jpg";
  import { IAuthUser } from "../../../auth/types";
  import { setOpen } from "../../../common/basket/CartReducer";
import { ProfileDropDown } from "./ProfileDropdown";
  
  function validateURL(url: string) {
    return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      url
    );
  }
  
  export const MainHeader = () => {
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [theme, setTheme] = useState(true);
  
    const { isAuth, image, roles, name } = useSelector(
      (store: any) => store.auth as IAuthUser
    );
  
    const dispatch = useDispatch();
    const navigator = useNavigate();
  
    const onChangeTheme = () => {
      if (!localStorage.theme) {
        localStorage.theme = "dark";
        document.body.classList.add("dark");
        setTheme(true);
      } else {
        localStorage.removeItem("theme");
        document.body.classList.remove("dark");
        setTheme(false);
      }
    };

    const onKeyPress = (event: any) => {
      if (event.key === "Enter") {
        navigator(
          "/products?page=1" +
            (event.target.value ? "&search=" + event.target.value : "")
        );
        event.target.value = "";
      }
    }
  
    useEffect(() => {
      if (localStorage.theme === "dark") {
        document.body.classList.add("dark");
      }
    }, []);


  
    return (
      <>
        <nav className="bg-white shadow dark:bg-gray-900">
          <div className="container px-3 py-2 mx-auto">
            <div className="lg:flex lg:items-center">
              <div className="flex items-center justify-between">
                <Link to="/">
                  <img className="w-auto h-8 my-2" src={logo} alt="logo" />
                </Link>

                <div className="flex lg:hidden">
                  {openMobileMenu ? (
                    <button
                      onClick={() => setOpenMobileMenu(false)}
                      type="button"
                      className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => setOpenMobileMenu(true)}
                      type="button"
                      className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                      aria-label="toggle menu"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div
                className={classNames(
                  "absolute inset-x-0 z-20 flex-1 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center lg:justify-between",
                  { "translate-x-0 opacity-100": openMobileMenu },
                  { "opacity-0 -translate-x-full": !openMobileMenu }
                )}
              >
                <div className="flex flex-col text-gray-600 capitalize dark:text-gray-300 lg:flex lg:px-16 lg:-mx-4 lg:flex-row lg:items-center">
                  <Link
                    to="/categories"
                    className="mt-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  >
                    Категорії
                  </Link>
                  <Link
                    to="/products"
                    className="mt-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  >
                    Товари
                  </Link>
                  <Link
                    to="/news"
                    className="mt-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  >
                    Новини
                  </Link>
                  {roles.toLowerCase().includes("admin") && (
                    <Link
                      to="/control-panel"
                      className="mt-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                    >
                      Панель Керування
                    </Link>
                  )}

                  <div className="relative mt-4 lg:mt-0 lg:mx-4">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-300"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>

                    <input
                      type="text"
                      onKeyPress={onKeyPress}
                      className="w-full py-1 pl-10 pr-4 text-gray-700 placeholder-gray-600 bg-white border-b border-gray-600 dark:placeholder-gray-300 dark:focus:border-gray-300 lg:w-56 lg:border-transparent dark:bg-gray-900 dark:text-gray-300 focus:outline-none focus:border-gray-600"
                      placeholder="Пошук"
                    />
                  </div>
                </div>

                <div className="flex items-center flex-wrap mt-4 lg:mt-0">
                  <button
                    onClick={() => dispatch(setOpen(true))}
                    className="flex w-full md:w-fit text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:my-0"
                  >
                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                    <p className="block mx-2 md:hidden md:mx-0">Корзина</p>
                  </button>

                  {theme ? (
                    <button
                      type="button"
                      onClick={onChangeTheme}
                      className="flex w-full md:w-fit text-gray-700 sm:my-3.5 lg:mx-4 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                    >
                      <SunIcon className="h-6 w-6" aria-hidden="true" />
                      <p className="block mx-2 md:hidden md:mx-0">Світла тема</p>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onChangeTheme}
                      className="flex w-full md:w-fit text-gray-700 sm:my-3.5 lg:mx-4 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:my-0"
                    >
                      <MoonIcon className="h-6 w-6" aria-hidden="true" />
                      <p className="block mx-2 md:hidden md:mx-0">Темна тема</p>
                    </button>
                  )}

                  {isAuth ? (
                    <ProfileDropDown
                      image={
                        image
                          ? validateURL(image)
                            ? image
                            : `${APP_ENV.IMAGE_PATH}100x100_${image}`
                          : usericon
                      }
                      name={name}
                    />
                  ) : (
                    <Link
                      to="/auth/login"
                      className="text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                    >
                      Увійти
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  };
  