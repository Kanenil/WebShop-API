import { useDispatch, useSelector } from "react-redux";
import http from "../../http";
import jwt from "jwt-decode";
import { IAuthUser } from "../auth/types";
import { IConfirmEmail, IProfileEdit } from "./types";
import Cookies from "js-cookie";
import { setUser } from "../auth/AuthReducer";
import { useFormik } from "formik";
import { ProfileSchema } from "./validation";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArchiveBoxXMarkIcon,
  ArrowLeftOnRectangleIcon,
  CheckIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { APP_ENV } from "../../env";
import classNames from "classnames";
import citylandscape from "../../assets/city-landscape.png";
import { ChangeEvent, useEffect, useState } from "react";
import userImage from "../../assets/user.jpg";
import Alert from "../common/alert";

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<"success" | "danger" | "warning" | "info">(
    "success"
  );
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const { image, name, emailConfirmed, email } = useSelector(
    (store: any) => store.auth as IAuthUser
  );

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const value: IConfirmEmail = {
      userId: searchParams.get("userId"),
      token: searchParams.get("code"),
    };
    if (value.token && value.userId) {
      http
        .post("/api/account/confirmEmail", value)
        .then((resp) => {
          const { token } = resp.data;
          saveToken(token);
          setMessage("Обліковий запис був успішно підтверджений.");
          setType("success");
          setAlertOpen(true);
        })
        .catch((error) => {
          setMessage("Обліковий запис вже підтверджений.");
          setType("info");
          setAlertOpen(true);
        });
    }
  }, []);

  const profileImage = image
    ? validateURL(image)
      ? image
      : `${APP_ENV.IMAGE_PATH}300x300_${image}`
    : userImage;

  const dispatch = useDispatch();

  const initValues: IProfileEdit = {
    firstName: name.split(" ")[0],
    lastName: name.split(" ")[1],
    image: profileImage,
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

  function validateURL(url: string) {
    return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      url
    );
  }

  const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { files } = target;
    if (files) {
      const file = files[0];
      setFieldValue("image", file);
    }
    target.value = "";
  };

  const onSubmitFormik = async (values: IProfileEdit) => {
    try {
      if (values.image instanceof File) {
        const formData = new FormData();
        formData.append("image", values.image);
        const imageResult = await http.post("/api/upload", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });
        values.image = imageResult.data.image;
      } else {
        values.image = image;
      }

      const result = await http.put("/api/account", values);
      const { token } = result.data;
      saveToken(token);
      touched.firstName = undefined;
      touched.lastName = undefined;
      values.image = `${APP_ENV.IMAGE_PATH}300x300_${values.image}`;
      setIsEdit(false);

      setMessage("Збережено зміни в профілі.");
      setType("success");
      setAlertOpen(true);
    } catch (error: any) {
      setMessage(
        "При збереженні на сервер, щось пішло не так. Попробуйте пізніше!"
      );
      setType("danger");
      setAlertOpen(true);
    }
  };

  const onConfirmEmail = () => {
    http
      .get("/api/account/confirmEmail")
      .then((resp) => {
        setMessage("Лист з підтвердженням відправлено, перевірте вашу пошту.");
        setType("success");
        setAlertOpen(true);
      })
      .catch((error) => {
        setMessage(
          "Не вдлаося відправити листа з підтвердження, попробуйте пізніше або зверніться в підтримку."
        );
        setType("danger");
        setAlertOpen(true);
      });
  };

  const onChangePassword = () => {
    if (emailConfirmed) {
      http
        .post("/api/account/forgotPassword", {
          email,
        })
        .then((resp) => {
          setMessage("Лист з зміною пароля відправлено, перевірте вашу пошту.");
          setType("success");
          setAlertOpen(true);
        })
        .catch((error) => {
          setMessage(
            "Не вдлаося відправити листа з зміною пароля, попробуйте пізніше або зверніться в підтримку."
          );
          setType("danger");
          setAlertOpen(true);
        });
    } else {
      setMessage("Для зміни пароля потрібно підтвердити електронну пошту!");
      setType("warning");
      setAlertOpen(true);
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: ProfileSchema,
    onSubmit: onSubmitFormik,
  });

  const { values, errors, touched, handleSubmit, handleChange, setFieldValue } =
    formik;

  return (
    <>
      <section className="flex w-full m-2 max-w-lg mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-7xl">
        <div className="flex justify-center">
          <img
            className="hidden bg-cover lg:block lg:w-2/5"
            src={citylandscape}
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
                Профіль.
              </h1>

              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Тут ви можете змінити особисту інформацію про себе.
              </p>

              {isEdit ? (
                <form
                  className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
                  onSubmit={handleSubmit}
                >
                  <label
                    htmlFor="image"
                    className="flex items-center col-span-2 gap-x-2 cursor-pointer"
                  >
                    <img
                      className="object-cover w-20 h-20 rounded-lg"
                      src={
                        values.image
                          ? values.image instanceof File
                            ? URL.createObjectURL(values.image)
                            : values.image
                          : userImage
                      }
                      alt=""
                    />
                    <div>
                      <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                        Виберіть фотографію
                      </h1>

                      <p className="text-base text-gray-500 dark:text-gray-400">
                        Дозволені розширення для фотографії JPG, JPEG або PNG
                      </p>
                    </div>
                  </label>
                  <input
                    className="hidden"
                    type="file"
                    id="image"
                    name="image"
                    accept="image/jpg, image/jpeg, image/png"
                    onChange={onFileChangeHandler}
                  />

                  <div className="lg:col-span-1 sm:col-span-2">
                    <label
                      htmlFor="firstName"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                    >
                      Ім'я
                    </label>
                    <input
                      type="text"
                      placeholder="Ім'я"
                      id="firstName"
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      className={classNames(
                        "block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40",
                        {
                          "dark:focus:border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-400 border-red-400":
                            touched.firstName && errors.firstName,
                          "dark:focus:border-green-300 focus:border-green-400 focus:ring-green-300 dark:border-green-400 border-green-400":
                            touched.firstName && !errors.firstName,
                        }
                      )}
                    />
                    {touched.firstName && errors.firstName && (
                      <p className="mt-3 text-xs text-red-400">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="lg:col-span-1 sm:col-span-2">
                    <label
                      htmlFor="lastName"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                    >
                      Прізвище
                    </label>
                    <input
                      type="text"
                      placeholder="Прізвище"
                      id="lastName"
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      className={classNames(
                        "block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40",
                        {
                          "dark:focus:border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-400 border-red-400":
                            touched.lastName && errors.lastName,
                          "dark:focus:border-green-300 focus:border-green-400 focus:ring-green-300 dark:border-green-400 border-green-400":
                            touched.lastName && !errors.lastName,
                        }
                      )}
                    />
                    {touched.lastName && errors.lastName && (
                      <p className="mt-3 text-xs text-red-400">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="lg:col-span-1 sm:col-span-2 flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    <span>Зберегти </span>

                    <PaperAirplaneIcon className="w-5 h-5 rtl:-scale-x-100" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEdit(false);
                      values.lastName = initValues.lastName;
                      values.firstName = initValues.firstName;
                      values.image = initValues.image;
                    }}
                    className="lg:col-span-1 sm:col-span-2 flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    <span>Скасувати </span>

                    <ArchiveBoxXMarkIcon className="w-5 h-5 rtl:-scale-x-100" />
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-x-2 py-5">
                    <img
                      className="object-cover w-16 h-16 rounded-lg"
                      src={
                        (values.image as string)
                          ? (values.image as string)
                          : userImage
                      }
                      alt=""
                    />

                    <div>
                      <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                        {name}
                      </h1>

                      <p className="text-base text-gray-500 dark:text-gray-400">
                        {email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEdit(true)}
                    className="mt-2 flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    <span>Редагувати</span>
                    <PencilIcon className="w-5 h-5 ml-5 rtl:-scale-x-100" />
                  </button>
                </>
              )}

              <div className="py-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Налаштування безпеки.
                </h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y dark:divide-gray-600 sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Пароль
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                      <button
                        onClick={onChangePassword}
                        className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      >
                        <span>Змінити</span>
                        <PencilIcon className="w-5 h-5 ml-5 rtl:-scale-x-100" />
                      </button>
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Електронна адреса
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                      {emailConfirmed ? (
                        <div className="flex text-green-500 text-base">
                          <span>Підтверджена</span>
                          <CheckIcon className="w-5 h-5 ml-2 rtl:-scale-x-100" />
                        </div>
                      ) : (
                        <button
                          onClick={onConfirmEmail}
                          className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                        >
                          <span>Підтвердити</span>
                          <EnvelopeIcon className="w-5 h-5 ml-5 rtl:-scale-x-100" />
                        </button>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="py-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Керування обліковим записом.
                </h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y dark:divide-gray-600 sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Вийти
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                      <Link
                        to="/auth/logout"
                        className="flex items-center justify-between w-fit px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      >
                        <span>Вийти</span>
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 ml-5 rtl:-scale-x-100" />
                      </Link>
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Видалити обліковий запис
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                      <button className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                        <span>Видалити</span>
                        <TrashIcon className="w-5 h-5 ml-5 rtl:-scale-x-100" />
                      </button>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Profile;
