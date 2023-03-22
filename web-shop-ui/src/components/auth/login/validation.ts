import * as yup from "yup";

export const LoginSchema = yup.object({
    email: yup.string().required("Email не може бути пустим!").email("Введіть email адресу!"),
    password: yup.string().required("Пароль є обов'язковим!"),
  });