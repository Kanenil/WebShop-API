import * as yup from "yup";

export const ForgotPasswordSchema = yup.object({
    email: yup.string().required("Email не може бути пустим!").email("Введіть email адресу!"),
  });