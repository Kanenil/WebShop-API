import { useSelector } from "react-redux";
import { IAuthUser } from "../auth/types";
import noimage from "../../assets/no-image.webp";
import { APP_ENV } from "../../env";
import { useState } from "react";
import http from "../../http";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Notification } from "../helpers/Notification";
import Cookies from "js-cookie";
import jwt from "jwt-decode";
import { setUser } from "../auth/AuthReducer";

interface IChangeInformation {
  image: boolean;
  name: boolean;
  lastname: boolean;
  email: boolean;
}

interface IEditUser {
  name: string;
  lastname: string;
  email: string;
}

interface INotification {
  message: string;
  type: "success" | "warning" | "error" | "info";
  state: boolean;
}

type FormValues = {
  imageFile: File;
  imageUrl: string;
};

function validateURL(url: string) {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
    url
  );
}

export const ProfilePage = () => {
  const user = useSelector((store: any) => store.auth as IAuthUser);
  const [formValues, setFormValues] = useState<FormValues>();
  const [showNotification, setShowNotification] = useState<INotification>({
    message: "",
    type: "success",
    state: false,
  });

  const handleShowNotification = (
    message: string,
    type: "success" | "warning" | "error" | "info"
  ) => {
    setShowNotification({
      message: message,
      type: type,
      state: true,
    });

    setTimeout(() => {
      setShowNotification({
        message: "",
        type: "success",
        state: false,
      });
    }, 5000);
  };

  const [editUser, setEditUser] = useState<IEditUser>({
    name: user.name.split(" ")[0],
    lastname: user.name.split(" ")[1],
    email: user.email,
  });

  const dispatch = useDispatch();

  const [changeStatus, setChangeStatus] = useState<IChangeInformation>({
    image: false,
    name: false,
    lastname: false,
    email: false,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormValues({ imageFile: file, imageUrl });
    }
  };

  const onChangeName = () => {
    if (
      editUser.name &&
      editUser.name.toLowerCase() != user.name.split(" ")[0].toLowerCase()
    ) {
      http
        .put("/api/account", {
          firstName: editUser.name,
          lastName: user.name.split(" ")[1],
          image: user.image,
        })
        .then((resp) => {
          const { token } = resp.data;
          saveToken(token);
        });
      setChangeStatus({ ...changeStatus, name: false });
    }
  };

  const onChangeLastName = () => {
    if (
      editUser.lastname &&
      editUser.lastname.toLowerCase() != user.name.split(" ")[1].toLowerCase()
    ) {
      http
        .put("/api/account", {
          firstName: user.name.split(" ")[0],
          lastName: editUser.lastname,
          image: user.image,
        })
        .then((resp) => {
          const { token } = resp.data;
          saveToken(token);
        });
      setChangeStatus({ ...changeStatus, lastname: false });
    }
  };

  const saveToken = (token: string) => {
    const decodedToken = jwt(token) as any;
    const expirationDate = new Date(decodedToken.exp * 1000);
    Cookies.set("token", token, { expires: expirationDate });
    http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    dispatch(
      setUser({
        isAuth: true,
        name: decodedToken?.name,
        email: decodedToken?.email,
        image: decodedToken?.image,
        roles: decodedToken?.roles,
        emailConfirmed: decodedToken?.emailConfirmed.toLowerCase() === "true",
      })
    );
  };

  const onSaveImage = () => {
    if (formValues) {
      const formData = new FormData();
      formData.append("image", formValues.imageFile);
      http
        .post("/api/upload", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((resp) => {
          http
            .put("/api/account", {
              firstName: user.name.split(" ")[0],
              lastName: user.name.split(" ")[1],
              image: resp.data!.image,
            })
            .then((resp) => {
              const { token } = resp.data;
              saveToken(token);
            });
        });
    }
    setFormValues(undefined);
    setChangeStatus({ ...changeStatus, image: false });
  };

  const onConfirmEmail = () => {
    http
      .get("/api/account/confirmEmail")
      .then((resp) => {
        handleShowNotification(
          "Надіслано лист на пошту з підтвердженням!",
          "success"
        );
      })
      .catch((error) => {
        handleShowNotification(
          "Помилка при надіслано листа на пошту!",
          "error"
        );
      });
  };

  const onChangePassword = () => {
    http
      .post("/api/account/forgotPassword", {
        email: user.email,
      })
      .then((resp) => {
        handleShowNotification(
          "Надіслано лист на пошту з зміною пароля!",
          "success"
        );
      })
      .catch((error) => {
        handleShowNotification(
          "Помилка при надіслано листа на пошту!",
          "error"
        );
      });
  };

  return (
    <>
      {showNotification.state && (
        <Notification
          message={showNotification.message}
          type={showNotification.type}
          onClose={() =>
            setShowNotification({
              message: "",
              type: "success",
              state: false,
            })
          }
        />
      )}

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Профіль
            </h2>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-6">
            <label
              className={changeStatus.image ? "cursor-pointer" : ""}
              htmlFor="image"
            >
              <img
                className="w-32 h-32 rounded-full object-cover"
                width={150}
                height={150}
                src={
                  changeStatus.image && formValues
                    ? formValues.imageUrl
                    : user.image
                    ? validateURL(user.image)
                      ? user.image
                      : `${APP_ENV.IMAGE_PATH}300x300_${user.image}`
                    : noimage
                }
                alt="User avatar"
              />
            </label>
            <input
              disabled={!changeStatus.image}
              type="file"
              id="image"
              name="image"
              accept="image/jpg, image/jpeg, image/png"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="text-center md:text-left">
              {changeStatus.image ? (
                <>
                  <button
                    onClick={onSaveImage}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Зберегти зміни
                  </button>
                  <button
                    onClick={() => {
                      setChangeStatus({ ...changeStatus, image: false });
                      setFormValues(undefined);
                    }}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Скасувати
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    setChangeStatus({ ...changeStatus, image: true })
                  }
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Змінити фотографію
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Персональна інформація
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Загальна інформація про користувача.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Ім'я</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.name.split(" ")[0]}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Прізвище</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.name.split(" ")[1]}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Електронна адреса
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-3 overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Редагувати особисті дані
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Налаштування особистих даних користувача.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Ім'я</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {changeStatus.name ? (
                    <>
                      <input
                        className="shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        value={editUser.name}
                        onChange={(e) =>
                          setEditUser({ ...editUser, name: e.target.value })
                        }
                        placeholder="Введіть нове ім'я"
                      />
                      <button
                        onClick={onChangeName}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Зберегти зміни
                      </button>
                      <button
                        onClick={() => {
                          setChangeStatus({ ...changeStatus, name: false });
                        }}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Скасувати
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        setChangeStatus({ ...changeStatus, name: true })
                      }
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Змінити ім'я
                    </button>
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Прізвище</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {changeStatus.lastname ? (
                    <>
                      <input
                        className="shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        value={editUser.lastname}
                        onChange={(e) =>
                          setEditUser({ ...editUser, lastname: e.target.value })
                        }
                        placeholder="Введіть нове ім'я"
                      />
                      <button
                        onClick={onChangeLastName}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Зберегти зміни
                      </button>
                      <button
                        onClick={() => {
                          setChangeStatus({ ...changeStatus, lastname: false });
                        }}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Скасувати
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        setChangeStatus({ ...changeStatus, lastname: true })
                      }
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Змінити прізвище
                    </button>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-3 overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Налаштування безпеки
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Налаштування безпеки користувача.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Пароль</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <button
                    onClick={onChangePassword}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Змінити пароль
                  </button>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Електронна адреса
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.emailConfirmed ? (
                    <h1 className="text-green-500 text-base">
                      Підтверджена{" "}
                      <CheckIcon className="h-6 w-6 inline-block" />
                    </h1>
                  ) : (
                    <button
                      onClick={onConfirmEmail}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Підтвердити електронну адресу
                    </button>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-3 overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Керування аккаунтом
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Налаштування аккаунта користувача.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Вийти</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Link
                    to="/auth/logout"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Вийти з аккаунта
                  </Link>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Видалити аккаунт
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Видалити аккаунт
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};
