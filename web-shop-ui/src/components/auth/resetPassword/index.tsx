import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import http from "../../../http";
import { setUser } from "../AuthReducer";
import { IResetPassword } from "./types";
import { ResetPasswordSchema } from "./validation";
import citylancscape from "../../../assets/city-landscape.png";
import { useState } from "react";
import Alert from "../../common/alert";

const ResetPassword = ()=>{
    const [searchParams] = useSearchParams();
    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    const navigator = useNavigate();
    const dispatch = useDispatch();

    const initValues: IResetPassword = {
        userId: searchParams.get("userId"),
        token: searchParams.get("code"),
        password: "",
        confirmPassword: "",
      };

      const onSubmitFormik = async (values: IResetPassword) => {
        try {
          const result = await http.post("/api/account/changepassword", values);
          if (Cookies.get("token")) {
            Cookies.remove("token");
            dispatch(
              setUser({
                isAuth: false,
                name: "",
                email: "",
                image: "",
                roles: "",
                emailConfirmed: false,
              })
            );
          }
          navigator("/auth/login");  
        } catch (error: any) {
          errors.token = "Схоже, що це посилання більше не дійсне, або сервер перегружений!";
          setAlertOpen(true);
        }
      }

      const formik = useFormik({
        initialValues: initValues,
        validationSchema: ResetPasswordSchema,
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
            {alertOpen && (
                <Alert
                  text={errors.token||""}
                  type={"danger"}
                  open={alertOpen}
                  setOpen={setAlertOpen}
                />
              )}


              <h1 className="mt-2 text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                Встановлення нового пароля.
              </h1>

              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Давайте все налаштуємо, щоб ви могли змінити свій пароль на новий.
              </p>

              
              <form
                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Пароль
                  </label>
                  <input
                    type="password"
                    placeholder="Введіть ваш новий пароль"
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
                    placeholder="Підтвердіть ваш новий пароль"
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
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
    )
}
export default ResetPassword;