import * as yup from "yup";

export const RegisterSchema = yup.object({
    firstName: yup.string().required("Це поле не може бути пустим!"),
    lastName: yup.string().required("Це поле не може бути пустим!"),
    email: yup.string().required("Email не може бути пустим!").email("Введіть email адресу!"),
    password: yup.string().min(6, "Пароль має бути як мінімум 6 символів").required("Пароль є обов'язковим!"),
    confirmPassword: yup.string().min(6, "Пароль має бути як мінімум 6 символів").oneOf([yup.ref("password")], "Паролі не співпадають").required("Це поле не може бути пустим!"),
  });