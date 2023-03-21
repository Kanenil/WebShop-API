import { useState } from "react";

export interface ISelectOption
{
    value: string;
    label: string;
}

interface Props
{
    options: ISelectOption[];
    seleted: ISelectOption;
    onChange: (page: number) => void;
}

export const DropdownBox :React.FC<Props> = ({
    options,
    seleted,
    onChange
  }) => {
    const [selectedOption, setSelectedOption] = useState(seleted);

    const onChangeHandler = (e: any)=>{
      setSelectedOption({value: e.target.value, label: e.target.value});
      onChange(e.target.value);
    }

    return (
        <select
          value={selectedOption.value}
          onChange={onChangeHandler}
          className="block w-16 py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer">
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
    );
  };