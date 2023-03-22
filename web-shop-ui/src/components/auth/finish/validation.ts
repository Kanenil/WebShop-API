import * as yup from "yup";

export const GoogleRegisterSchema = yup.object({
    firstName: yup.string().required("Це поле не може бути пустим!"),
    lastName: yup.string().required("Це поле не може бути пустим!"),
    token: yup.string(),
  });