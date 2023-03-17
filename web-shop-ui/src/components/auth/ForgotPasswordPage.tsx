import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import http from "../../http";
import logo from "../../logo.svg";

interface ForgotPasswordValues {
  email: string;
}

export const ForgotPasswordPage = () => {
  const [message, setMessage] = useState<string>("");
  const [sendClass, setSendClass] = useState<string>("");

  const onSubmitHandler = (
    values: ForgotPasswordValues,
    { setSubmitting }: any
  ) => {
    http
      .post("/api/account/forgotpassword", {
        email: values.email,
      })
      .then((resp) => {
        setMessage(
          "Лист з відновленням надіслано. Будь ласка перевірте вашу пошту."
        );
        setSendClass("text-green-600");
      })
      .catch((error) => {
        setMessage("Не знайдено аккаунта за такою електронною поштою або пошта не підтвердженна!");
        setSendClass("text-red-600");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img className="mx-auto h-12 w-auto" src={logo} alt="logo" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Відновлення пароля
            </h2>
            <p className={"mt-2 text-center text-sm " + sendClass}>{message}</p>
          </div>
          <Formik initialValues={{ email: "" }} onSubmit={onSubmitHandler}>
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-4">
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Електронна пошта
                    </label>
                    <Field
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Електронна пошта"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between">
                  <div className="text-sm mt-3 ml-2 md:mt-0">
                    <Link
                      to="/auth/login"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Я згадав свій пароль
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      {isSubmitting ? (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm6.364 5.657a8 8 0 004.95-2.071l1.414 1.414a10 10 0 01-6.364 2.828v-2.171zM20 12a8 8 0 01-8 8v-4a4 4 0 004-4h4zm-9.536-5.657a8 8 0 00-4.95 2.071l-1.414-1.414a10 10 0 016.364-2.828v2.171z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="group-hover:text-white h-5 w-5 text-indigo-500 group-focus:text-white transition ease-in-out duration-150"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11.59l3.3-3.3a1 1 0 10-1.42-1.42L11 11.17l-2.88-2.88a1 1 0 00-1.42 1.42l3.3 3.3a1 1 0 001.42 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    Відправити запит на відновлення
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
