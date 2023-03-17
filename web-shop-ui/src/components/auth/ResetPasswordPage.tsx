import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Field, ErrorMessage, Form } from "formik";
import http from "../../http";
import logo from "../../logo.svg";
import { useDispatch } from "react-redux";
import { AuthActionType } from "./types";

interface ForgotPasswordForm {
  userId: string | null;
  token: string | null;
  password: string;
  confirmPassword: string;
}

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();

  const navigator = useNavigate();
  const dispatch = useDispatch();

  const initialValues: ForgotPasswordForm = {
    userId: searchParams.get("userId"),
    token: searchParams.get("code"),
    password: "",
    confirmPassword: "",
  };

  const onSubmitHandler = (values: ForgotPasswordForm) => {
    http.post("/api/account/changepassword", values).then((resp) => {
      if(localStorage.getItem("token"))
      {
        localStorage.removeItem("token");
        dispatch({type: AuthActionType.USER_LOGOUT});
      }
        
      navigator("/auth/login");
    });
  };

  const validate = (values: ForgotPasswordForm) => {
    const errors: Partial<ForgotPasswordForm> = {};
    if (!values.password) {
      errors.password = "Пароль є обов'язковим";
    } else if (values.password.length < 6) {
      errors.password = "Мінімальна довжина пароля - 6 символів";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Підтвердження пароля є обов'язковим";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Паролі не співпадають";
    }
    return errors;
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img className="mx-auto h-12 w-auto" src={logo} alt="logo" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Створення нового пароля
            </h2>
          </div>
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={onSubmitHandler}
          >
            {({ errors, touched }) => (
              <Form className="mt-8 space-y-2">
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Пароль
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      required
                      className={`relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset ${
                        errors.password && touched.password
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      } sm:text-sm sm:leading-6`}
                      placeholder="Пароль"
                    />
                  </div>
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-sm text-red-600"
                />
                <div className="-space-y-px rounded-md shadow-sm">
                  <label htmlFor="confirmPassword" className="sr-only">
                    Підтвердити пароль
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="confirmPassword"
                    required
                    className={`relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    } sm:text-sm sm:leading-6`}
                    placeholder="Підтвердити пароль"
                  />
                </div>

                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />

                <div className="mt-1 flex flex-wrap items-center justify-between">
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Відновити пароль
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
