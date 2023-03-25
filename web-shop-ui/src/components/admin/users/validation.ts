import * as yup from "yup";

export const UserBanSchema = yup.object({
  time: yup
    .number()
    .required("Це поле не може бути пустим!")
    .integer("Введіть число!")
    .typeError("Введіть число!"),
});