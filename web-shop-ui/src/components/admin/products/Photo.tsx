import { useState } from "react";
import { PhotoProps } from "./types";

export const Photo = ({ photo, onDelete }: PhotoProps) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div
        className="relative overflow-hidden rounded-lg shadow-md cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={photo.url} alt="" className="h-72 object-cover" />
        {isHovered && (
          <button
            className="absolute top-0 right-0 m-2 p-2 text-white bg-red-500 rounded-full"
            onClick={() => onDelete(photo.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  };
  