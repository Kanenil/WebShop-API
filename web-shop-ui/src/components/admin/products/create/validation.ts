import * as yup from "yup";

const digitsOnly = (value: string | undefined) =>
  /^\d*[.{1}\d*]\d*$/.test(value || "") || (value || "").length === 0;

export const CreateProductSchema = yup.object().shape({
  name: yup.string().required("Це обов'язкове поле!"),
  description: yup.string().nullable().default(""),
  categoryId: yup.number().required("Це обов'язкове поле!").integer(),
  price: yup
    .string()
    .test("price-is-valid", "Поле має містити лише числа!", digitsOnly)
    .test(
      "price-is-positive",
      "Число має бути більшим за 0.01!",
      (value) => parseFloat(value || "") > 0.01
    )
    .typeError("Введіть число!"),
  images: yup
    .array()
    .of(
      yup
        .mixed()
        .test((value) => typeof value === "string" || value instanceof File)
    )
    .test({
      message: "Виберіть хоча б одне фото!",
      test: (arr) => arr?.length !== 0,
    }),
});
