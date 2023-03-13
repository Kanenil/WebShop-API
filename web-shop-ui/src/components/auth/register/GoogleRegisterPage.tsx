import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jwt-decode";
import { IGoogleJWT, IGoogleRegisterUser } from "./types";
import { useDispatch } from "react-redux";
import { LinkIcon } from "@heroicons/react/20/solid";
import logo from "../../../logo.svg";
import http from "../../../http";
import { AuthActionType } from "../types";

export const GoogleRegisterPage = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  let { token } = useParams();

  const [state, setState] = useState<IGoogleRegisterUser>({
    firstName: "",
    lastName: "",
    image: "",
    token: "",
  });

  useEffect(() => {
    const decodeJWT = jwt<IGoogleJWT>(token as string);
    setState({
      firstName: decodeJWT.given_name,
      lastName: decodeJWT.family_name,
      image: decodeJWT.picture,
      token: token as string,
    });
  }, []);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(state.firstName && state.lastName)
    {
        http
        .post("/api/auth/google/register", state)
        .then((resp) => {
          const { token } = resp.data;
        localStorage.setItem("token", token);
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        dispatch({type: AuthActionType.USER_LOGIN});
          navigator("/");
        });
        
    }
  };

  return (
<>
<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          <div>
            <img className="mx-auto h-12 w-auto" src={logo} alt="logo" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Завершіть Реєстрацію
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
                    value={state.lastName}
                    onChange={onChangeHandler}
                    type="text"
                    autoComplete="lastname"
                    required
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Прізвище"
                  />
                </div>
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
                Завершити Реєстрацію
              </button>
            </div>
          </form>
        </div>
      </div>
</>
  );
};
