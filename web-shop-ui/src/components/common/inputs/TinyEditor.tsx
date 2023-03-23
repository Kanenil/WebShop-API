import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

interface Props {
  label: string;
  value?: string;
  field: string;
  touched?: boolean | null;
  error?: string | null;
  onChange: (content: string) => void;
}

export const TinyEditor: React.FC<Props> = ({
  label,
  value = "<p>Редактор</p>",
  field,
  touched = null,
  error = null,
  onChange,
}) => {
  return (
    <>
      <label
        htmlFor={field}
        className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
      >
        {label}
      </label>
      <Editor
          id={field}
          apiKey="embuig9iimcqnl5d9dzytl9wh9330zvstczvzz9cpgy96gju"
          value={value}
          onEditorChange={onChange}
          init={{
            height: 350,
            max_height: 500,
            min_height: 200,
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
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
        {touched && error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </>
  );
};
