import { ISelectItem } from "./types";
import classNames from "classnames";

interface Props {
  label: string;
  value: string | number;
  field: string;
  touched?: boolean | null;
  items: ISelectItem[];
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<Props> = ({
  label,
  field,
  touched,
  value,
  items,
  error,
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
      <select
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
      >
        {items.map((item) => (
          <option key={item.label} className="text-white" value={item.value}>{item.label}</option>
        ))}
      </select>
      {touched && error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </>
  );
};
