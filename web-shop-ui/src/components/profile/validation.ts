import * as yup from "yup";

export const ProfileSchema = yup.object({
  firstName: yup.string().required("Це поле не може бути пустим!"),
  lastName: yup.string().required("Це поле не може бути пустим!"),
});
