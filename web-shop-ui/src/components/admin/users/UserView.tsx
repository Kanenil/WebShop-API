import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import http from "../../../http";
import { useFormik } from "formik";
import { SelectField } from "../../common/inputs/SelectField";
import { APP_ENV } from "../../../env";
import { Link } from "react-router-dom";
import Alert from "../../common/alert";
import usericon from "../../../assets/user.jpg";
import { IEditUser, IUserItem } from "./types";
import { FormField } from "../../common/inputs/FormField";
import { UserBanSchema } from "./validation";
import { useSelector } from "react-redux";
import { IAuthUser } from "../../auth/types";
import classNames from "classnames";
function validateURL(url: string) {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
    url
  );
}

interface Props {
  user: IUserItem;
  onSubmit: () => void;
}

const UserView: React.FC<Props> = ({ user, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertBanOpen, setAlertBanOpen] = useState<boolean>(false);
  const { email } = useSelector((store: any) => store.auth as IAuthUser);
  const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        http.get('/api/users/roles').then(resp=>{
            setRoles(resp.data);
        })
    }, []);


  const initValues: IEditUser = {
    time: user.bannedTo || "0",
    role: user.roles,
    email: user.email
  };

  const onSubmitFormik = async (values: IEditUser) => {
    try {
      const result = await http.put("/api/users", values);

      if(parseInt(values.time) > 0)
        values.role = 'User';

      onSubmit();
      setAlertOpen(true);
    } catch (error: any) {}
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: UserBanSchema,
    onSubmit: onSubmitFormik,
  });

  const removeBan = () => {
    values.time = '0';
    http.put("/api/users", values).then(resp=>{
      onSubmit();
      setAlertBanOpen(true);
    });
  }

  const { values, handleSubmit, handleChange, errors, touched, setFieldValue } = formik;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="text-indigo-600 hover:text-indigo-900"
      >
        Детальніше
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div
            className="flex min-h-screen text-center md:block md:px-2 lg:px-4"
            style={{ fontSize: 0 }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden md:inline-block md:align-middle md:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <div
                className={classNames(
                  "flex text-base text-left transform transition w-full md:inline-block md:px-4 md:my-8 md:align-middle",
                  { "lg:max-w-4xl": user.cart.length > 0 },
                  { "md:max-w-md": user.cart.length == 0 }
                )}
              >
                <div className="w-full relative flex items-center bg-white dark:bg-gray-900 px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="w-full grid grid-cols-1 gap-y-8 gap-x-6 items-start sm:grid-cols-12 lg:gap-x-8">
                    <div
                      className={classNames(
                        {
                          "sm:col-span-8 lg:col-span-5": user.cart.length > 0,
                        },
                        {
                          "sm:col-span-12 lg:col-span-12":
                            user.cart.length == 0,
                        }
                      )}
                    >
                      <Alert
                        text={"Успішно збережно!"}
                        type={"success"}
                        open={alertOpen}
                        setOpen={setAlertOpen}
                      />
                      <Alert
                        text={"Успішно розблоковано!"}
                        type={"success"}
                        open={alertBanOpen}
                        setOpen={setAlertBanOpen}
                      />
                      {email === user.email && (
                        <div className="mb-3 font-medium dark:text-white">
                          Це ваш профіль
                        </div>
                      )}
                      <div className="flex items-center mt-2">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              user.image
                                ? validateURL(user.image)
                                  ? user.image
                                  : `${APP_ENV.IMAGE_PATH}100x100_${user.image}`
                                : usericon
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.fullname}
                          </div>
                          <div className="text-gray-500">{user.email}</div>
                        </div>
                      </div>

                      <section className="mt-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Роль: {user.roles}
                        </p>
                      </section>

                      <section className="mt-2">
                        <p className="flex font-medium text-gray-900 dark:text-white">
                          Електронна пошта:{" "}
                          {user.emailConfirmed ? (
                            <p className="text-green-500 ml-1">Підтвердженна</p>
                          ) : (
                            <p className="text-red-500 ml-1">
                              Не підтвердженна
                            </p>
                          )}
                        </p>
                      </section>

                      {user.banned && (
                        <section className="mt-2">
                          <p className="flex font-medium text-gray-900 dark:text-white">
                            <p className="text-red-500">
                              Заблокований до {user.bannedTo}
                            </p>
                          </p>
                        </section>
                      )}

                      {user.cart.length > 0 && (
                        <section className="mt-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            В кошику на суму:{" "}
                            {user.cart
                              .reduce(
                                (acc, item) =>
                                  acc +
                                  parseFloat(item.product.price) -
                                  ((parseFloat(item.product.price) *
                                    parseInt(item.product.decreasePercent)) /
                                    100) *
                                    item.count,
                                0
                              )
                              .toLocaleString()}{" "}
                            ₴
                          </p>
                        </section>
                      )}

                      {email !== user.email &&
                        !user.banned &&
                        !user.roles.toLowerCase().includes("admin") && (
                          <section className="mt-6">
                            <form onSubmit={handleSubmit}>
                              {user.bannedTo == null && (
                                <FormField
                                  label={"Час блокування в хв."}
                                  value={values.time}
                                  field={"time"}
                                  onChange={handleChange}
                                  placeholder={"Час блокування"}
                                  error={errors.time}
                                  touched={touched.time}
                                />
                              )}

                              <div className="mt-3">
                                <SelectField
                                  label={"Роль"}
                                  value={values.role}
                                  field={"role"}
                                  items={roles.map((role) => {
                                    return {
                                      label: role,
                                      value: role,
                                    };
                                  })}
                                  onChange={handleChange}
                                />
                              </div>

                              <button
                                type="submit"
                                className="mt-8 w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Зберегти
                              </button>
                            </form>
                          </section>
                        )}
                      {user.bannedTo != null && (
                        <button
                          type="button"
                          onClick={removeBan}
                          className="mt-8 w-full bg-red-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Розблокувати
                        </button>
                      )}
                    </div>
                    {user.cart.length > 0 && (
                      <div className="col-span-7">
                        <h2 className="text-xl font-medium text-gray-900 dark:text-white sm:pr-12">
                          В кошику
                        </h2>
                        {user.cart.map((item) => (
                          <div
                            key={`user-${user.email}-product-${item.product.id}`}
                            className="py-3 border-b border-gray-200 dark:border-gray-600 flex space-x-6"
                          >
                            <img
                              src={`${APP_ENV.IMAGE_PATH}300x300_${item.product.images[0]}`}
                              alt={item.product.images[0]}
                              className="flex-none w-20 h-20 object-center bg-gray-100 rounded-lg sm:w-28 sm:h-28 object-contain"
                            />
                            <div className="flex-auto flex flex-col">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-300">
                                  <Link to={`/products/${item.product.id}`}>
                                    {item.product.name.length > 15
                                      ? item.product.name.substring(0, 15) +
                                        "..."
                                      : item.product.name}
                                  </Link>
                                </h4>
                                <Link
                                  to={`/products?category=${item.product.category}`}
                                  className="text-sm text-gray-600 dark:text-gray-500"
                                >
                                  {item.product.category}
                                </Link>
                              </div>
                              <div className="mt-6 flex-1 flex items-end">
                                <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                                  <div className="flex">
                                    <dt className="font-medium text-gray-900 dark:text-gray-400">
                                      Кількість
                                    </dt>
                                    <dd className="ml-2 text-gray-700 dark:text-gray-300">
                                      {item.count}
                                    </dd>
                                  </div>
                                  <div className="pl-4 flex sm:pl-6">
                                    {parseInt(item.product.decreasePercent) ==
                                    0 ? (
                                      <>
                                        <dt className="font-medium text-gray-900 dark:text-gray-400">
                                          Ціна за шт.
                                        </dt>
                                        <dd className="ml-2 text-gray-700 dark:text-gray-300">
                                          {item.product.price.toLocaleString()}{" "}
                                          ₴
                                        </dd>
                                      </>
                                    ) : (
                                      <>
                                        <dt className="font-medium text-gray-900 dark:text-gray-400">
                                          Ціна за шт.
                                        </dt>
                                        <dd className="ml-2 text-gray-700 dark:text-gray-300">
                                          <p className="text-red-500">
                                            {(
                                              parseFloat(item.product.price) -
                                              (parseFloat(item.product.price) *
                                                parseInt(
                                                  item.product.decreasePercent
                                                )) /
                                                100
                                            ).toLocaleString()}{" "}
                                            ₴
                                          </p>
                                          <p className="text-xs line-through">
                                            {item.product.price.toLocaleString()}{" "}
                                            ₴
                                          </p>
                                        </dd>
                                      </>
                                    )}
                                  </div>
                                </dl>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default UserView;
