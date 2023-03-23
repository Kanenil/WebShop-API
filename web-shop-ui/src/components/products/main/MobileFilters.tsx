import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { FilterOption } from "./FilterOption";
import { IProductFilter, IProductFilterItem } from "./types";

interface Props {
    filters: IProductFilter[];
    onChange: (category: string) => void;
    setFilters: (filter: IProductFilter[]) => void;
}

export const MobileFilters: React.FC<Props> = ({ filters,
    setFilters,
    onChange,}) => {
    const onChangeFilter = (
        filter: IProductFilter,
        option: IProductFilterItem
      ) => {
        const index = filters.indexOf(filter) || 0;
        const newFilter = filters[index];
        const optIndex = newFilter.items.indexOf(option);
    
        newFilter.items.forEach((item) => (item.value = false));
    
        newFilter.items[optIndex].value = true;
        onChange(option.label);
        setFilters([
          ...filters.filter((item) => item.label !== newFilter.label),
          newFilter,
        ]);
      };
  return (
    <>
    {filters.map((filter) => (
        <Disclosure
        as="div"
        key={"mobile-"+filter.label}
        className="border-t border-gray-200 px-4 py-6"
      >
        {({ open }) => (
          <>
            <h3 className="-mx-2 -my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between px-2 py-3 text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {filter.label}
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
                {filter.items.map((option, optionIdx) => (
                  <FilterOption filter={filter} option={option} optionId={optionIdx} onChange={onChangeFilter} />
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