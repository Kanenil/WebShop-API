import { useEffect, useState } from "react";
import http from "../../../http";
import Alert from "../../common/alert";
import { IForgotPassword } from "./types";
import citylancscape from "../../../assets/amazing-city-landscape.png";
import { useFormik } from "formik";
import { ForgotPasswordSchema } from "./validation";
import classNames from "classnames";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";
import { IAuthUser } from "../types";

const ForgotPassword = () => {
  const initValues: IForgotPassword = {
    email: "",
  };
  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<"success" | "danger">("success");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const navigator = useNavigate();

  const { isAuth } = useSelector(
    (store: any) => store.auth as IAuthUser
  );

  useEffect(() => {
    if(isAuth) 
      navigator('/profile');
  }, [])

  const onSubmitFormik = async (values: IForgotPassword) => {
    try {
      const result = await http.post("/api/account/forgotPassword", values);
      setMessage("Лист з відновленням відправлено, перевірте вашу пошту.");
      setType("success");
      setAlertOpen(true);
    } catch (error: any) {
      setMessage(
        "Не вдалося відправити лист з відновленням або пошта не підтвердженна."
      );
      setType("danger");
      setAlertOpen(true);
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: ForgotPasswordSchema,
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
                  text={message}
                  type={type}
                  open={alertOpen}
                  setOpen={setAlertOpen}
                />
              )}
              <h1 className="mt-2 text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                Відновлення пароля.
              </h1>

              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Введіть вашу електронну пошту, яка приєднана в вашому обліковому
                записі, та нажміть Надіслати.
              </p>

              <form
                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
                onSubmit={handleSubmit}
              >
                <div className="lg:col-span-2 sm:col-span-1">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Електронна пошта
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
                      }
                    )}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-3 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  <span>Надіслати </span>

                  <PaperAirplaneIcon className="w-5 h-5 rtl:-scale-x-100" />
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
export default ForgotPassword;
