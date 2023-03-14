import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import noimage from "../../../assets/no-image.webp";
import http from "../../../http";

type FormValues = {
  imageFile: File;
  imageUrl: string;
};

export const CreateCategoryPage = () => {
  const [formValues, setFormValues] = useState<FormValues>();
  const [name, setName] = useState<string>("");

  const navigator = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormValues({ imageFile: file, imageUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formValues && name) {
      const formData = new FormData();
      formData.append("image", formValues.imageFile);

      http
        .post("/api/upload", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((resp) => {
          http
            .post("/api/categories", {
              name: name,
              image: resp.data!.image,
            })
            .then((resp) => {
              navigator("/control-panel/categories");
            });
        });
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Добавити Категорію
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Назва
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введіть назву"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
            Фотографія
            {!formValues && (
              <img src={noimage} width={250} alt="" className="cursor-pointer mb-4" />
            )}
            {formValues && (
              <img
                src={formValues.imageUrl}
                width={250}
                alt="Uploaded Image"
                className="cursor-pointer mb-4"
              />
            )}
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="hidden border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex items-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Добавити
          </button>
          <Link
            to="/control-panel/categories"
            className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded ml-2"
          >
            Повернутись до списку
          </Link>
        </div>
      </form>
    </>
  );
};
