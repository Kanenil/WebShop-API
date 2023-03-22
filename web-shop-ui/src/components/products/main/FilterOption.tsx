import { IProductFilter, IProductFilterItem } from "./types";

interface Props {
  filter: IProductFilter;
  option: IProductFilterItem;
  optionId: number;
  onChange: (filter: IProductFilter, option: IProductFilterItem) => void;
}

export const FilterOption: React.FC<Props> = ({
  filter,
  option,
  optionId,
  onChange,
}) => {
  return (
    <>
      <div key={"option-value-" + option.value} className="flex items-center">
        <input
          id={`filter-${filter.label}-${optionId}`}
          name={`${filter.label}`}
          type="radio"
          checked={option.value}
          onChange={() => onChange(filter, option)}
          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor={`filter-${filter.label}-${optionId}`}
          className="ml-3 text-sm text-gray-600 dark:text-gray-300 hover:dark:text-white cursor-pointer"
        >
          {option.label}
        </label>
      </div>
    </>
  );
};
