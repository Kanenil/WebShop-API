import React from "react";
import { Link } from "react-router-dom";
import { DeleteDialog } from "./DeleteDialog";

interface Props {
  list: any[];
  onDelete: (id: number) => void;
}

export const ListGenerator: React.FC<Props> = ({ list, onDelete }) => {
  const fields = list.length ? Object.keys(list[0]) : [];
  let i = 0;

  return (
    <>
      {list.map((item) => (
        <tr key={"list-item-" + i++}>
          {fields.map((field) =>
            field == "Фотографія" ? (
              <td
                key={"row-" + field + "-" + item}
                className="px-4 py-4 text-sm whitespace-nowrap"
              >
                <div>
                  <img
                    className="object-cover w-14 h-14 -mx-1 border-white rounded-full dark:border-gray-700 shrink-0"
                    src={item[field]}
                    alt=""
                  />
                </div>
              </td>
            ) : (
              <td
                key={"row-" + field + "-" + item}
                className="px-4 py-4 text-sm whitespace-nowrap"
              >
                <div>
                  <h4 className="text-gray-700 dark:text-gray-300">{item[field]}</h4>
                </div>
              </td>
            )
          )}
          <td className="px-4 py-4 text-sm whitespace-nowrap">
            <div className="flex items-center gap-x-6">
              <DeleteDialog
                title={"Видалення"}
                description={`Ви дійсно бажаєте видалити "${item['Назва']}"?`}
                onSubmit={() => onDelete(item['#'])}
              />

              <Link
                to={"edit/" + item['#']}
                className="text-gray-500 dark:text-gray-300 dark:hover:text-yellow-500 transition-colors duration-200  focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};
