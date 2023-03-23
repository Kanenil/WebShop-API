import Alert from "../../../common/alert";
import citylandscape from "../../../../assets/city-landscape.png";
import { useEffect, useState } from "react";
import { ICreateProduct } from "./types";
import http from "../../../../http";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { CreateProductSchema } from "./validation";
import {
  ArchiveBoxXMarkIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { FormField } from "../../../common/inputs/FormField";
import { TinyEditor } from "../../../common/inputs/TinyEditor";
import { SelectField } from "../../../common/inputs/SelectField";
import { ICategoryValue } from "../types";
import { ImagesField } from "../../../common/inputs/ImagesField";
import noimage from "../../../../assets/no-image.webp";

const CreateProduct = () => {
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategoryValue[]>([]);
  const navigator = useNavigate();

  const initValues: ICreateProduct = {
    name: "",
    description: "<p>Опис товару</p>",
    categoryId: 1,
    price: 0,
    images: [],
  };

  const onSubmitFormik = async (values: ICreateProduct) => {
    try {
      const images :string[] = [];
      for (const item of values.images || []) {
        if (item instanceof File) {
          const formData = new FormData();
          formData.append("image", item);
          const imageResult = await http.post("/api/upload", formData, {
            headers: { "content-type": "multipart/form-data" },
          });
          images.push(imageResult.data.image);
        }
      }
      values.images = images;
      
      const result = await http.post("/api/products", values);
      
      navigator('..');
    } catch (error: any) {
       setAlertOpen(true);
    }
  };

  useEffect(() => {
    http.get("/api/categories/selector").then((resp) => {
        setCategories(resp.data);
      });
  }, [])
  

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: CreateProductSchema,
    onSubmit: onSubmitFormik,
  });

  const { values, errors, touched, handleSubmit, handleChange, setFieldValue } =
    formik;

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
                Добавити товар.
              </h1>

              <form
                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
                onSubmit={handleSubmit}
              >
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
                    value={values.price}
                    label={"Ціна"}
                    placeholder={"Ціна"}
                    field={"price"}
                    error={errors.price}
                    touched={touched.price}
                  />
                </div>

                <div className="col-span-2">
                  <SelectField
                    onChange={handleChange}
                    value={values.categoryId}
                    label={"Категорія"}
                    field={"categoryId"}
                    error={errors.categoryId}
                    touched={touched.categoryId}
                    items={categories.map((item) => {
                      return { label: item.name, value: item.id };
                    })}
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

                <div className="col-span-2">
                  <ImagesField
                    value={values.images}
                    field={"images"}
                    defaultImage={noimage}
                    onChange={(value) => {
                        setFieldValue("images", value);
                        
                        
                        console.log(value);
                    } }
                    error={errors.images}
                    touched={touched.images}
                  />
                </div>

                <button
                  type="submit"
                  className="lg:col-span-1 sm:col-span-2 flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  <span>Добавити </span>

                  <PlusCircleIcon className="w-5 h-5 rtl:-scale-x-100" />
                </button>
                <Link
                  to=".."
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
export default CreateProduct;
