import { useSelector } from "react-redux";
import { APP_ENV } from "../../../../env";
import { IAuthUser } from "../../../auth/types";
import usericon from "../../../../assets/user.jpg";
import logo from "../../../../logo.svg";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { ArchiveBoxIcon, ArrowLeftOnRectangleIcon, BuildingStorefrontIcon, FireIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";

function validateURL(url: string) {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
    url
  );
}

export const AdminMenu = () => {
  const [theme, setTheme] = useState(true);

  const { name, image, email } = useSelector(
    (store: any) => store.auth as IAuthUser
  );

  const profileImage = image
    ? validateURL(image)
      ? image
      : `${APP_ENV.IMAGE_PATH}500x500_${image}`
    : usericon;

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


  useEffect(() => {
    if (localStorage.theme === "dark") {
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <>
      <aside className="flex flex-col min-h-screen max-h-full w-fit max-w-64 px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <NavLink to="/control-panel" className="mx-auto">
          <img className="w-auto h-6 sm:h-7" src={logo} alt="" />
        </NavLink>

        <div className="hidden md:flex flex-col items-center mt-6 -mx-2">
          <img
            className="object-cover w-24 h-24 mx-2 rounded-full"
            src={profileImage}
            alt="avatar"
          />
          <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">
            {name}
          </h4>
          <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            {email}
          </p>
        </div>

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            <NavLink
              className={({ isActive }) =>
                classNames(
                  "flex items-center px-4 py-2",
                  {
                    "text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-200":
                      isActive,
                  },
                  {
                    "text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700":
                      !isActive,
                  }
                )
              }
              to="categories"
            >
              <ArchiveBoxIcon className="w-5 h-5 hidden md:block"/>

              <span className="mx-0 md:mx-4 font-medium">Категорії</span>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                classNames(
                  "flex items-center px-4 py-2 mt-5",
                  {
                    "text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-200":
                      isActive,
                  },
                  {
                    "text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700":
                      !isActive,
                  }
                )
              }
              to="products"
            >
              <BuildingStorefrontIcon className="w-5 h-5 hidden md:block"/>

              <span className="mx-0 md:mx-4 font-medium">Товари</span>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                classNames(
                  "flex items-center px-4 py-2 mt-5",
                  {
                    "text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-200":
                      isActive,
                  },
                  {
                    "text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700":
                      !isActive,
                  }
                )
              }
              to="sales"
            >
              <FireIcon className="w-5 h-5 hidden md:block"/>

              <span className="mx-0 md:mx-4 font-medium">Акції</span>
            </NavLink>

            <hr className="my-6 border-gray-200 dark:border-gray-600" />

            {theme ? (
              <button
                type="button"
                onClick={onChangeTheme}
                className="flex w-full md:w-fit text-gray-700 sm:my-3.5 lg:mx-4 transition-colors duration-300 transform dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
              >
                <SunIcon className="h-6 w-6 hidden md:block" aria-hidden="true" />
                <p className="mx-2 md:mx-4 font-medium">Світла тема</p>
              </button>
            ) : (
              <button
                type="button"
                onClick={onChangeTheme}
                className="flex w-full md:w-fit text-gray-700 sm:my-3.5 lg:mx-4 transition-colors duration-300 transform dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 md:my-0"
              >
                <MoonIcon className="h-6 w-6 hidden md:block" aria-hidden="true" />
                <p className="mx-2 md:mx-4 font-medium">Темна тема</p>
              </button>
            )}

            <hr className="my-6 border-gray-200 dark:border-gray-600" />

            <NavLink
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to="/"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 hidden md:block"/>

              <span className="mx-0 md:mx-4 font-medium">На головну</span>
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};
