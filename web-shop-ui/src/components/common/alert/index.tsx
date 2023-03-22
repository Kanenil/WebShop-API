import {
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import classNames from "classnames";
import { useState } from "react";

interface Props {
  text: string;
  type: "success" | "danger" | "warning" | "info";
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertComponent: React.FC<Props> = ({ text, type = "success",open,setOpen }) => {
  return (
    <>
      {open && (
        <div
          className={classNames(
            "w-full text-white",
            { "bg-emerald-500": type == "success" },
            { "bg-blue-500": type == "info" },
            { "bg-yellow-400": type == "warning" },
            { "bg-red-500": type == "danger" }
          )}
        >
          <div className="container flex items-center justify-between px-6 py-4 mx-auto">
            <div className="flex">
              {type == "success" && (
                <CheckIcon className="w-6 h-6 fill-current" />
              )}
              {type == "info" && (
                <ExclamationTriangleIcon className="w-6 h-6 fill-current" />
              )}
              {type == "warning" && (
                <ExclamationTriangleIcon className="w-6 h-6 fill-current" />
              )}
              {type == "danger" && (
                <ShieldExclamationIcon className="w-6 h-6 fill-current" />
              )}

              <p className="mx-3">{text}</p>
            </div>

            <button onClick={()=>setOpen(false)} className="p-1 transition-colors duration-300 transform rounded-md hover:bg-opacity-25 hover:bg-gray-600 focus:outline-none">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default AlertComponent;
