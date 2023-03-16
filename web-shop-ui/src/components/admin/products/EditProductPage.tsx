import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import noimage from "../../../assets/no-image.webp";
import http from "../../../http";
import { Editor } from "@tinymce/tinymce-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  FormValues,
  ICategoryValue,
  IEditProduct,
  PhotoData,
} from "./types";
import { Photo } from "./Photo";
import { APP_ENV } from "../../../env";

export const EditProductPage = () => {
  const [categories, setCategories] = useState<Array<ICategoryValue>>([]);
  const { id } = useParams();

  const [state, setState] = useState<IEditProduct>({
    name: "",
    description: "Опис товару",
    category: 0,
    images: [],
    price: "0.01",
  });

  const [photos, setPhotos] = useState<Array<PhotoData>>([]);

  const handleDelete = (id: string) => {
    setState((prevState) => {
      return {
        ...prevState,
        images: (prevState.images as FormValues[]).filter(
          (image) => image.imageUrl !== id
        ),
      };
    });
    setState((prevState) => {
      return {
        ...prevState,
        images: (prevState.images as string[]).filter((image) => image !== id),
      };
    });
    setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(photos);
    const items2 = Array.from<FormValues | string>(state.images);
    const [reorderedItemPhotos] = items.splice(result.source.index, 1);
    const [reorderedItemState] = items2.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItemPhotos);
    items2.splice(result.destination.index, 0, reorderedItemState);
    setPhotos(items);
    setState({...state, images: items2 as (FormValues[] | string[])});
  };
  
  const selectors = categories.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  if (parseInt(state.category.toString()) < 0) {
    const cat = categories.find(
      (item) => item.name == state.category.toString()
    );
    setState({ ...state, category: cat?.id ? cat.id : 0 });
  }

  useEffect(() => {
    http.get("/api/categories/selector").then((resp) => {
      setCategories(resp.data);
      const cats = resp.data as ICategoryValue[];
      http
        .get("/api/products/id/" + id)
        .then((resp) => {
          const cat = cats.find((item) => item.name == resp.data.category);
          setState({
            name: resp.data.name,
            description: resp.data.description,
            category: cat?.id ? cat.id : 0,
            images: resp.data.images,
            price: resp.data.price,
          });
          setPhotos(
            resp.data!.images.map((data: string) => ({
              id: data,
              url: APP_ENV.IMAGE_PATH + "500x500_" + data,
            }))
          );
        })
        .catch((error) => {
          navigator("/control-panel/*");
        });
    });
  }, []);

  const editorRef = useRef(null);

  const navigator = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const updatedImages = [];
      const updatedPhotos = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = URL.createObjectURL(file);

        updatedImages.push({
          imageFile: file,
          imageUrl,
        });

        updatedPhotos.push({
          id: imageUrl,
          url: imageUrl,
        });
      }
      setState({
        ...state,
        images: [...(state.images as FormValues[]), ...updatedImages],
      });
      setPhotos([...photos, ...updatedPhotos]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(state);

    if (
      state.category &&
      state.images &&
      state.name &&
      state.price &&
      parseFloat(state.price) > 0.01
    ) {
      const uploadedImages: string[] = [];
      console.log(photos, state.images);
      
      for (const item of state.images) {
        if ((item as FormValues).imageFile == undefined) {
          uploadedImages.push(item as string);
          continue;
        }

        const formData = new FormData();
        formData.append("image", (item as FormValues).imageFile);

        await http
          .post("/api/upload", formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((resp) => {
            uploadedImages.push(resp.data!.image);
          });
      }

      const data = {
        id: id,
        name: state.name,
        description: state.description,
        categoryId: state.category,
        price: parseFloat(state.price),
        images: uploadedImages,
      };

      await http.put("/api/products", data).then((resp) => {
        navigator("/control-panel/products");
      });
    }
  };

  const handleEditorChange = (content: string) => {
    setState({ ...state, description: content });
  };

  return (
    <>
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Редагувати Продукт
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
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
            placeholder="Введіть назву"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="category"
          >
            Категорія
          </label>
          <select
            id="category"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
            onChange={(e) =>
              setState({ ...state, category: parseInt(e.target.value) })
            }
            value={state.category}
          >
            <option value={0} disabled>
              Оберіть категорію
            </option>
            {selectors}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="price">
            Ціна
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="price"
            value={state.price}
            onChange={(e) => setState({ ...state, price: e.target.value })}
            placeholder="Введіть назву"
          />
        </div>
        <div className="mb-4">
          <h1 className="block text-gray-700 font-bold mb-2">Фотографії</h1>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="photos">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-md cursor-pointer">
                    <label htmlFor="image">
                      <img
                        src={noimage}
                        alt=""
                        className="cursor-pointer h-72 object-cover"
                      />
                    </label>
                  </div>
                  {photos.map((photo, index) => (
                    <Draggable
                      key={photo.id}
                      draggableId={photo.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Photo photo={photo} onDelete={handleDelete} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            multiple={true}
            className="hidden border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="desc">
            Опис
          </label>
          <Editor
            id="desc"
            apiKey="embuig9iimcqnl5d9dzytl9wh9330zvstczvzz9cpgy96gju"
            ref={editorRef}
            value={state.description}
            onEditorChange={handleEditorChange}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
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
            to="/control-panel/products"
            className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded ml-2"
          >
            Повернутись до списку
          </Link>
        </div>
      </form>
    </>
  );
};
