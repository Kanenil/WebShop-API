import * as yup from "yup";

export const ResetPasswordSchema = yup.object({
    token: yup.string(),
    password: yup.string().min(6, "Пароль має бути як мінімум 6 символів").required("Пароль є обов'язковим!"),
    confirmPassword: yup.string().min(6, "Пароль має бути як мінімум 6 символів").oneOf([yup.ref("password")], "Паролі не співпадають").required("Це поле не може бути пустим!"),
  });