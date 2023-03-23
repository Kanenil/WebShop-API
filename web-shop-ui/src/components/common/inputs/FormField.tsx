import classNames from "classnames";
import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  field: string;
  touched?: boolean | null;
  error?: string | null;
  type?: "text" | "email" | "password" | "number" | "hidden" | "string" | "date";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormField: React.FC<Props> = ({
  label,
  field,
  touched = null,
  placeholder,
  error = null,
  type = "text",
  value,
  onChange,
  ...props
}) => {
  return (
    <>
      <label
        htmlFor={field}
        className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        id={field}
        onChange={onChange}
        value={value}
        name={field}
        className={classNames(
          "block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40",
          {
            "dark:focus:border-red-300 focus:border-red-400 focus:ring-red-300 dark:border-red-400 border-red-400":
              touched && error,
            "dark:focus:border-green-300 focus:border-green-400 focus:ring-green-300 dark:border-green-400 border-green-400":
              touched && !error,
          }
        )}
      />
      {touched && error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </>
  );
};
