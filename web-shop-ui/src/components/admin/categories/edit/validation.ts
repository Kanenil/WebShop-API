import * as yup from "yup";

export const CategoryEditSchema = yup.object({
  name: yup.string().required("Це поле не може бути пустим!"),
});