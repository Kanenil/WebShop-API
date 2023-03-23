import { TrashIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { InputHTMLAttributes } from "react";

interface Props {
  label?: string;
  description?: string;
  value: File | string | null;
  field: string;
  defaultImage: string;
  touched?: boolean | null;
  error?: string | null;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const FileField: React.FC<Props> = ({
  label = "Виберіть фотографію",
  description = "Дозволені розширення для фотографії JPG, JPEG або PNG",
  field,
  touched = null,
  error = null,
  accept = "image/jpg, image/jpeg, image/png",
  value,
  onChange,
  defaultImage,
  onClear,
  ...props
}) => {
  return (
    <>
      <div className="flex items-center col-span-2 gap-x-2">
        <label className="cursor-pointer" htmlFor={field}>
          <img
            className="object-cover w-20 h-20 rounded-lg"
            src={
              value
                ? value instanceof File
                  ? URL.createObjectURL(value)
                  : value
                : defaultImage
            }
            alt=""
          />
        </label>

        <div>
          <label className="cursor-pointer" htmlFor={field}>
            <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
              {label}
            </h1>
          </label>

          <p className="text-base text-gray-500 dark:text-gray-400">
            {description}
          </p>

          {value && value !== defaultImage && (
            <button
              onClick={onClear}
              type="button"
              className="flex items-center justify-between px-6 mt-2 py-2 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              <span>Очистити</span>
              <TrashIcon className="w-5 h-5 ml-5 rtl:-scale-x-100" />
            </button>
          )}

          {touched && error && (
            <p className="mt-3 text-xs text-red-400">{error}</p>
          )}
        </div>
      </div>

      <input
        className="hidden"
        type="file"
        id={field}
        name={field}
        accept={accept}
        onChange={onChange}
      />
    </>
  );
};
