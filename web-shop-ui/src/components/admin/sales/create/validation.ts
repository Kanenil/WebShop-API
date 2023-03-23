import * as yup from "yup";

const today = new Date();

export const SaleCreateSchema = yup.object({
  name: yup.string().required("Це поле не може бути пустим!"),
  decreasePercent: yup
    .number()
    .required("Це поле не може бути пустим!")
    .min(1, "Знижка має бути не меньше 1 %!")
    .max(100, "Знижка не має бути більше 100 %!")
    .integer("Введіть число!"),
  expireTime: yup
    .date()
    .min(today, "Кінець акції не може бути раніше ніж завтра!"),
  image: yup
    .mixed()
    .required("Виберіть фотографію!")
    .test((value) => typeof value === "string" || value instanceof File),
});
