import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import http from "../../http";
import { AuthActionType } from "../auth/types";

interface ConfirmEmail {
  userId: string | null;
  token: string | null;
}

export const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const value: ConfirmEmail = {
      userId: searchParams.get("userId"),
      token: searchParams.get("code"),
    };
    http
      .post("/api/account/confirmEmail", value)
      .then((resp) => {
        const { token } = resp.data;
        localStorage.setItem("token", token);
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        dispatch({ type: AuthActionType.USER_LOGIN });
      })
      .catch((resp) => {
        navigator("/profile");
      });
  }, []);
  return (
    <>
      <main className="grid min-h-full place-items-center py-24 px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">Успішно!</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Підтвердженно!
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Вашу електронну пошту успішно підтвердженно.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/profile"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Назад в профіль
            </Link>
            <Link to="/" className="text-sm font-semibold text-gray-900">
              На головну <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};
