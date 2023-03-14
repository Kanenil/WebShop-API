import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import noimage from "../../../assets/no-image.webp";
import { APP_ENV } from "../../../env";
import http from "../../../http";

type FormValues = {
  imageFile: File;
  imageUrl: string;
};

function validateURL(url: string) {
       return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(url);
    }

export const EditCategoryPage = () => {
  const [formValues, setFormValues] = useState<FormValues>();
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const { id } = useParams();


  const navigator = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormValues({ imageFile: file, imageUrl });
    }
  };

  useEffect(() => {
    http.get('/api/categories/id/'+id).then(resp=>{
        setName(resp.data!.name);
        setImage(resp.data!.image);
    })
  }, [])
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((formValues || image) && name) {


        if(formValues)
        {
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
                  .put("/api/categories", {
                    id:id,
                    name: name,
                    image: resp.data!.image,
                  })
                  .then((resp) => {
                    navigator("/control-panel/categories");
                  });
              });
        }
        else
        {
            http
                  .put("/api/categories", {
                    id: id,
                    name: name,
                    image: image,
                  })
                  .then((resp) => {
                    navigator("/control-panel/categories");
                  });
        }

      
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Редагувати Категорію
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
              <img src={image ? validateURL(image)?image:`${APP_ENV.IMAGE_PATH}500x500_${image}` : noimage} width={250} alt="" className="cursor-pointer mb-4" />
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
            Редагувати
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
