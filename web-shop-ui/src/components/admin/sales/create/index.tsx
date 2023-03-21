import { Editor } from "@tinymce/tinymce-react";
import { ChangeEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../../http";
import { ICreateSale, IFile } from "./types";

const CreateSalePage = () => {
  const [state, setState] = useState<ICreateSale>({
    name: "",
    image: "",
    description: "",
    decreasePercent: 0,
    expireTime: "",
  });
  const [file, setFile] = useState<IFile>();
  const [isHovered, setIsHovered] = useState(false);

  const editorRef = useRef(null);
  const navigator = useNavigate();

  const handleEditorChange = (content: string) => {
    setState({ ...state, description: content });
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setFile({ url: imageUrl, file });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.name && state.decreasePercent && state.decreasePercent && state.expireTime && file) {
      const formData = new FormData();
      formData.append("image", file.file);

      http
        .post("/api/upload", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((resp) => {
          state.image = resp.data!.image;
          http.post("/api/sales", state).then((resp) => {
            navigator("/control-panel/sales");
          });
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
          Добавити Акцію
        </h1>

        <div className="flex items-center justify-center w-full mb-6">
          {file != undefined ? (
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative aspect-w-1 aspect-h-1 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 rounded-lg bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <img
                  src={file?.url}
                  className="object-contain max-h-60 max-w-full"
                />
                {isHovered && (
                  <button
                    className="absolute top-0 right-0 m-2 p-2 text-white bg-red-500 rounded-full"
                    onClick={() => setFile(undefined)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Нажміть, щоб загрузити</span>{" "}
                  або закиньте сюди
                </p>
                <p className="text-xs text-gray-500">PNG, JPG або JPEG</p>
              </div>
              <input
                onChange={handleFileChange}
                id="dropzone-file"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Назва
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={state.name}
            onChange={onChangeHandler}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Назва"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="decreasePercent"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Знижка в %
          </label>
          <input
            type="text"
            id="decreasePercent"
            name="decreasePercent"
            value={state.decreasePercent}
            onChange={onChangeHandler}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder=""
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="expireTime"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Кінець акції
          </label>
          <input
            type="date"
            id="expireTime"
            name="expireTime"
            value={state.expireTime}
            onChange={onChangeHandler}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="expireTime"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Опис
          </label>
          <Editor
            id="desc"
            apiKey="embuig9iimcqnl5d9dzytl9wh9330zvstczvzz9cpgy96gju"
            ref={editorRef}
            initialValue="<p>Опис акції</p>"
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

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Добавити
        </button>
        <Link
          to={"/control-panel/sales"}
          className="ml-2 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Назад до списку
        </Link>
      </form>
    </>
  );
};

export default CreateSalePage;
