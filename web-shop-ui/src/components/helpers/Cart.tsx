import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MinusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ICart, ICartItem, setCart, setOpen } from "./CartReducer";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import emptycart from "../../assets/empty-cart.avif";

export const Cart = () => {
  const { isOpen, cart } = useSelector(
    (store: any) => store.shoppingCart as ICart
  );
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const onProductClick = (id: number) => {
    dispatch(setOpen(false));
    navigator("/products/" + id);
  };

  const removeItemFromCart = (itemId: number) => {
    const updatedCart = cart.filter((cartItem) => cartItem.id !== itemId);
    dispatch(setCart(updatedCart));
  };

  const handleQuantityChange = (id: number, change: number) => {
    const index = cart.findIndex((cartItem: ICartItem) => cartItem.id === id);
    const updatedCart = [...cart];
    updatedCart[index].quantity += change;
    dispatch(setCart(updatedCart));
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => dispatch(setOpen(false))}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Корзина
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => dispatch(setOpen(false))}
                          >
                            <span className="sr-only">Закрити панель</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {cart.length === 0 ? (
                              <div className="flex flex-col items-center justify-center">
                                <img
                                  src={emptycart}
                                  alt="Empty Cart"
                                  className="h-60 w-60 mb-4"
                                />
                                <p className="text-lg font-medium text-gray-500">
                                  Ой, здається, тут порожньо! Але це ніколи не пізно виправити!
                                </p>
                                <Link
                                  to="/products"
                                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                  onClick={() => dispatch(setOpen(false))}
                                >
                                  Перейти до списку товарів
                                </Link>
                              </div>
                            ) : (
                              cart.map((product) => (
                                <li key={product.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 flex justify-center items-center">
                                    <img
                                      src={product.image}
                                      alt={"product-" + product.id}
                                      className="object-contain max-h-full max-w-full"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <button
                                            onClick={() =>
                                              onProductClick(product.id)
                                            }
                                          >
                                            {product.name.length > 20
                                              ? product.name.substring(0, 20) +
                                                "..."
                                              : product.name}
                                          </button>
                                        </h3>
                                        <p className="ml-4">
                                          {(product.quantity*product.price).toLocaleString()} ₴
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {product.category}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleQuantityChange(product.id, -1)
                                          }
                                          className="text-gray-500 rounded-l-md bg-gray-200 hover:bg-gray-300 px-2 py-1"
                                          disabled={product.quantity - 1 <= 0}
                                        >
                                          <MinusIcon className="h-4 w-4" />
                                        </button>
                                        <p className="text-gray-500 px-2 border-2 border-gray-200">
                                          {product.quantity}
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleQuantityChange(product.id, 1)
                                          }
                                          className="text-gray-500 rounded-r-md bg-gray-200 hover:bg-gray-300 px-2 py-1"
                                        >
                                          <PlusIcon className="h-4 w-4" />
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeItemFromCart(product.id)
                                          }
                                          className="text-gray-500 font-medium hover:text-red-500 flex items-center"
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {cart.length > 0 && (
                      <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Загалом</p>
                          <p>
                            {cart
                              .reduce(
                                (acc, item) => acc + item.price * item.quantity,
                                0
                              )
                              .toLocaleString()}{" "}
                            ₴
                          </p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Акційні товари враховані в суму.
                        </p>
                        <div className="mt-6">
                          <a
                            href="#"
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                          >
                            Оформити замовлення
                          </a>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            або{"  "}
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => dispatch(setOpen(false))}
                            >
                              Продовжити покупки
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
