import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { IFilter, IFilterItem } from "../types";
import { FilterOption } from "./FilterOption";

interface Props {
    filters: IFilter[];
    onChange: (option : IFilterItem)=>void;
}

export const ProductFiltersMobile: React.FC<Props> = ({ filters, onChange }) => {
  return (
    <>
    {filters.map((filter) => (
        <Disclosure
        as="div"
        key={filter.id}
        className="border-t border-gray-200 px-4 py-6"
      >
        {({ open }) => (
          <>
            <h3 className="-mx-2 -my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between px-2 py-3 text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">
                  {filter.name}
                </span>
                <span className="ml-6 flex items-center">
                  {open ? (
                    <MinusIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  ) : (
                    <PlusIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6">
              <div className="space-y-6">
                {filter.options.map((option, optionIdx) => (
                  <div
                    key={option.value}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      id={`filter-mobile-${filter.id}-${optionIdx}`}
                      name={`${filter.id}[]`}
                      defaultValue={option.value}
                      type="checkbox"
                      defaultChecked={option.checked}
                      onChange={() => onChange(option)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`filter-mobile-${filter.id}-${optionIdx}`}
                      className="ml-3 min-w-0 flex-1 text-gray-500"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      ))}
    </>
  );
};