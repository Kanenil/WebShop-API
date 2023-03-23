interface Props {
    name: any;
  }
  
  export const HeaderGenerator: React.FC<Props> = ({ name }) => {
    return (
      <>
        {name != undefined && Object.getOwnPropertyNames(name).map((key) => (
          <th
            key={"head-" + key}
            scope="col"
            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            {key}
          </th>
        ))}
        <th
            scope="col"
            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
          />
      </>
    );
  };
  