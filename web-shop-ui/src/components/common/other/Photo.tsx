import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface Props {
  photo: string | File;
  onDelete: (id: string | File) => void;
}


export const Photo : React.FC<Props> = ({ photo, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    const url = photo instanceof File?URL.createObjectURL(photo):photo;

    return (
      <div
        className="relative overflow-hidden dark:bg-gray-100 rounded-lg shadow-md cursor-pointer flex justify-center items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={url} alt="" className="h-44 object-contain max-w-full" />
        {isHovered && (
          <button
            type="button"
            className="absolute top-0 right-0 m-2 p-2 text-white bg-red-500 rounded-full"
            onClick={() => onDelete(photo)}
          >
            <XMarkIcon className="h-6 w-6"/>
          </button>
        )}
      </div>
    );
  };
  