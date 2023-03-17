import { LockClosedIcon } from '@heroicons/react/20/solid'
import { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import http from '../../../http'
import logo from '../../../logo.svg'
import { AuthActionType } from '../types'
import { GoogleAuth } from './GoogleAuth'
import { ILoginUser } from './types'

export const LoginPage = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState<ILoginUser>({
    email: "",
    password: ""
  });

  useEffect(() => {
    if(localStorage.token != undefined)
      navigator('/*');
  }, [])
  

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(state.email && state.password)
    {
        http
        .post("/api/auth/login", state)
        .then((resp) => {
          const { token } = resp.data;
        localStorage.setItem("token", token);
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        dispatch({type: AuthActionType.USER_LOGIN});
          navigator("/");
        });
        
    }
  }

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={logo}
              alt="logo"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Увійти в аккаунт
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Або{' '}
              <Link to="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                зареєструвати новий
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSubmitHandler}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Електронна пошта
                </label>
                <input
                  id="email-address"
                  onChange={onChangeHandler}
                  value={state.email}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Електронна пошта"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  onChange={onChangeHandler}
                  value={state.password}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Пароль"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Запам'ятати
                </label>
              </div>

              <div className="text-sm mt-3 ml-2 md:mt-0">
                <Link to="/auth/forgotpassword" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Забули пароль?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Увійти
              </button>
            </div>

            <hr className="h-px my-8 bg-indigo-200 border-0 dark:bg-indigo-700"/>

            <div className="flex justify-center">
              <GoogleAuth/>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}
