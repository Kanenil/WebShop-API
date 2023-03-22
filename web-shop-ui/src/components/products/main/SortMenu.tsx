import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Fragment } from "react";
import { ISortOption } from "./types";

interface Props {
  current?: string;
  options?: ISortOption[];
  onChange: (value: string) => void;
}

export const SortMenu: React.FC<Props> = ({
  current,
  options,
  onChange,
}: Props) => {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Сортувати
            <ChevronDownIcon
              className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-white"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-40 bg-white dark:bg-gray-900 origin-top-right rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {options?.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => {
                    return (
                      <button
                        onClick={() => onChange(option.value)}
                        className={classNames(
                          "block w-full py-2 text-sm",
                          {
                            "font-medium text-gray-900 dark:text-white":
                              option.value === current,
                          },
                          {
                            "text-gray-500 dark:text-gray-400":
                              option.value !== current,
                          },
                          { "bg-gray-100 dark:bg-gray-700": active }
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  }}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

SortMenu.defaultProps = {
  current: "",
  options: [
    { label: "За замовчуванням", value: "" },
    { label: "За алфавітом (A-Z)", value: "nameAscending" },
    { label: "За алфавітом (Z-A)", value: "nameDescending" },
    { label: "За спаданням ціни", value: "priceHighToLow" },
    { label: "За зростанням ціни", value: "priceLowToHigh" },
  ],
};
