import { IFilter, IFilterItem } from "../types";

interface Props {
    filter: IFilter;
    option: IFilterItem;
    optionId: number;
    onChange: (option : IFilterItem)=>void;
}

export const FilterOption: React.FC<Props> = ({ filter,option,optionId, onChange }) => {
    return (
        <div
        key={"option-value-"+option.value}
        className="flex items-center"
      >
        <input
          id={`filter-${filter.id}-${optionId}`}
          name={`${filter.id}`}
          defaultValue={option.value}
          type="radio"
          checked={option.checked}
          onChange={()=>onChange(option)}
          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor={`filter-${filter.id}-${optionId}`}
          className="ml-3 text-sm text-gray-600 cursor-pointer"
        >
          {option.label}
        </label>
      </div>
    );
  };