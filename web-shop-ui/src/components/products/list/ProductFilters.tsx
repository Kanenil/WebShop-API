import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { IFilter, IFilterItem } from "../types";
import { FilterOption } from "./FilterOption";

interface Props {
    filters: IFilter[];
    onChange: (option : IFilterItem)=>void;
}

export const ProductFilters: React.FC<Props> = ({ filters, onChange }) => {
  return (
    <>
    {filters.map((filter) => (
        <Disclosure
        as="div"
        key={"section-block-"+filter.id}
        className="border-b border-gray-200 py-6"
      >
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
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
              <div className="space-y-4">
                {filter.options.map((option, optionIdx) => (
                  <FilterOption key={option.value} filter={filter} option={option} optionId={optionIdx} onChange={onChange} />
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