import { ArchiveBoxXMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Editor } from "@tinymce/tinymce-react";
import { useFormik } from "formik";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import Alert from "../../../common/alert";
import { FileField } from "../../../common/inputs/FileField";
import { FormField } from "../../../common/inputs/FormField";
import { TinyEditor } from "../../../common/inputs/TinyEditor";
import { ISaleEdit } from "./types";
import { SaleEditSchema } from "./validation";
import defaultImage from "../../../../assets/no-image.webp";
import citylandscape from "../../../../assets/amazing-city-landscape.png";
import { ProductsDialog } from "./ProductsDialog";

const EditSalePage = () => {
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const { id } = useParams();
  const navigator = useNavigate();

  const initValues: ISaleEdit = {
    id: id || "",
    name: "",
    decreasePercent: 1,
    description: "<p>Опис акції</p>",
    image: null,
    expireTime: new Date().toISOString().substring(0, 10),
  };

  const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { files } = target;
    if (files) {
      const file = files[0];
      setFieldValue("image", file);
    }
    target.value = "";
  };

  const onSubmitFormik = async (values: ISaleEdit) => {
    try {
      if (values.image instanceof File) {
        const formData = new FormData();
        formData.append("image", values.image);
        const imageResult = await http.post("/api/upload", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });
        values.image = imageResult.data.image;
      }
      console.log(values);

      const result = await http.put("/api/sales", values);

      navigator("../..");
    } catch (error: any) {
      setAlertOpen(true);
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: SaleEditSchema,
    onSubmit: onSubmitFormik,
  });

  const { values, errors, touched, handleSubmit, handleChange, setFieldValue } =
    formik;

  useEffect(() => {
    http
      .get<ISaleEdit>("/api/sales/" + id)
      .then((resp) => {
        const { data } = resp;
        setFieldValue("name", data.name);
        setFieldValue("description", data.description);
        setFieldValue("decreasePercent", data.decreasePercent);
        setFieldValue(
          "expireTime",
          new Date(data.expireTime).toISOString().substring(0, 10)
        );
        setFieldValue("image", APP_ENV.IMAGE_PATH + "500x500_" + data.image);
      })
      .catch((error) => {
        navigator("/control-panel/error404");
      });
  }, []);

  return (
    <>
      <section className="flex items-center justify-center m-2 max-w-lg mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-7xl">
        <div className="flex justify-center">
          <img
            className="hidden bg-cover lg:block lg:w-2/5"
            src={citylandscape}
          />

          <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
            <div className="w-full">
              <Alert
                text={"Упс... Щось пішло не так! Попробуйте пізніше."}
                type={"danger"}
                open={alertOpen}
                setOpen={setAlertOpen}
              />
              <h1 className="mt-2 text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                Редагувати акцію.
              </h1>

              <form
                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
                onSubmit={handleSubmit}
              >
                <FileField
                  onClear={() => setFieldValue("image", null)}
                  onChange={onFileChangeHandler}
                  value={values.image}
                  field={"image"}
                  defaultImage={defaultImage}
                  error={errors.image}
                  touched={touched.image}
                />

                <div className="col-span-2">
                  <FormField
                    onChange={handleChange}
                    value={values.name}
                    label={"Назва"}
                    placeholder={"Назва"}
                    field={"name"}
                    error={errors.name}
                    touched={touched.name}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    onChange={handleChange}
                    value={values.expireTime}
                    label={"Кінець акції"}
                    type="date"
                    placeholder={"Кінець акції"}
                    field={"expireTime"}
                    error={errors.expireTime}
                    touched={touched.expireTime}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    onChange={handleChange}
                    value={values.decreasePercent}
                    label={"Знижка"}
                    placeholder={"Знижка"}
                    field={"decreasePercent"}
                    error={errors.decreasePercent}
                    touched={touched.decreasePercent}
                  />
                </div>

                <div className="col-span-2">
                  <TinyEditor
                    onChange={(content) =>
                      setFieldValue("description", content)
                    }
                    value={values.description}
                    label={"Опис"}
                    field={"description"}
                    error={errors.description}
                    touched={touched.description}
                  />
                </div>

                <ProductsDialog id={id} />

                <button
                  type="submit"
                  className="lg:col-span-1 sm:col-span-2 flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  <span>Редагувати </span>

                  <PencilIcon className="w-5 h-5 rtl:-scale-x-100" />
                </button>
                <Link
                  to="../.."
                  className="lg:col-span-1 sm:col-span-2 flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  <span>Назад </span>

                  <ArchiveBoxXMarkIcon className="w-5 h-5 rtl:-scale-x-100" />
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditSalePage;
