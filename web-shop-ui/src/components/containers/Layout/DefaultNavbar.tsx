import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  ShoppingCartIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import logo from "../../../logo.svg";
import { IAuthUser } from "../../auth/types";
import { useDispatch, useSelector } from "react-redux";
import usericon from "../../../assets/user.jpg";
import { APP_ENV } from "../../../env";
import { Cart } from "../../helpers/Cart";
import { setOpen } from "../../helpers/CartReducer";
import { ICategoryItem } from "../../admin/categories/types";
import http from "../../../http";

function validateURL(url: string) {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
    url
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigator = useNavigate();

  const dispatch = useDispatch();

  const { isAuth, image, roles } = useSelector(
    (store: any) => store.auth as IAuthUser
  );

  const [categories, setCategories] = useState<ICategoryItem[]>([]);

useEffect(() => {
  http.get('/api/categories', {
    params: {
      'page': 1,
      'countOnPage':5
    }
  }).then(resp=>{
    setCategories(resp.data);
  })
}, [])


  function handleKeyPress(event: any) {
    if (event.key === "Enter") {
      navigator(
        "/products?page=1" +
          (event.target.value ? "&search=" + event.target.value : "")
      );
    }
  }

  return (
    <>
      <header className="bg-white">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <img className="h-8 w-auto" src={logo} alt="logo" />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            <Popover className="relative">
              <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                Категорії
                <ChevronDownIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-72 max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {categories.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                      >
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          <img className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                            aria-hidden="true"
                            src={APP_ENV.IMAGE_PATH+"100x100_"+item.image}/>
                        </div>
                        <div className="flex-auto">
                          <Link
                            to={"/products?page=1&search=Категорія:\""+item.name+'\"'}
                            className="block font-semibold text-gray-900"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                      >
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          <ChartPieIcon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                            aria-hidden="true"/>
                        </div>
                        <div className="flex-auto">
                          <Link
                            to={"/categories"}
                            className="block font-semibold text-gray-900"
                          >
                            Всі категорії
                            <span className="absolute inset-0" />
                          </Link>
                        </div>
                      </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
            <Link
              to="/news"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Новини
            </Link>
            {roles.toLowerCase().includes("admin") ? (
              <Link
                to="/control-panel"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Панель Керування
              </Link>
            ) : (
              ""
            )}
          </Popover.Group>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <input
              className="shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Пошук"
              onKeyPress={handleKeyPress}
            />
            <button
              type="button"
              onClick={() => dispatch(setOpen(true))}
              className="ml-3 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray focus:ring-offset-2 focus:ring-offset-white-800"
            >
              <span className="sr-only">Корзина</span>
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {isAuth ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Вікрити меню</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={
                        image
                          ? validateURL(image)
                            ? image
                            : `${APP_ENV.IMAGE_PATH}500x500_${image}`
                          : usericon
                      }
                      alt=""
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Профіль
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/auth/logout"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Вийти
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to="/auth/login"
                className="ml-3 text-sm font-semibold leading-6 text-gray-900"
              >
                Увійти <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img className="h-8 w-auto" src={logo} alt="logo" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-50">
                          Категорії
                          <ChevronDownIcon
                            className={classNames(
                              open ? "rotate-180" : "",
                              "h-5 w-5 flex-none"
                            )}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 space-y-2">
                          {[...categories].map((item) => (
                            <Disclosure.Button
                              key={item.name}
                              as="a"
                              onClick={()=>navigator("/products?page=1&search=Категорія:\""+item.name+'\"')}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                              {item.name}
                            </Disclosure.Button>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Link
                    to="/news"
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Новини
                  </Link>
                  {roles.toLowerCase().includes("admin") ? (
                    <Link
                      to="/control-panel"
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Панель Керування
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
                <div className="py-6">
                  <input
                    className="shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Пошук"
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(setOpen(true))}
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Корзина
                  </button>
                  {isAuth ? (
                    <>
                      <Link
                        to="/profile"
                        className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Профіль
                      </Link>
                      <Link
                        to="/auth/logout"
                        className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Вийти
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/auth/login"
                      className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Увійти
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
      <Outlet />
      <Cart />
    </>
  );
}
