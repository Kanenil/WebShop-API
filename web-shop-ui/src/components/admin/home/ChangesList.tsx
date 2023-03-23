import { IDevLog } from "./types";

interface Props {
  array: IDevLog[];
}

export const ChangesList: React.FC<Props> = ({ array }) => {
  return (
    <>
      <ol className="border-l border-neutral-300 dark:border-neutral-500">
        {array.map(item=>(
            <li key={item.title}>
          <div className="flex-start flex items-center pt-3">
            <div className="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-neutral-300 dark:bg-neutral-500"></div>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              {item.date}
            </p>
          </div>
          <div className="mt-2 ml-4 mb-6">
            <h4 className="mb-1.5 text-xl font-semibold dark:text-gray-400">{item.title}</h4>
            <p className="mb-3 text-neutral-500 dark:text-neutral-500">
                {item.description}
            </p>
          </div>
        </li>
        ))}
        
      </ol>
    </>
  );
};
