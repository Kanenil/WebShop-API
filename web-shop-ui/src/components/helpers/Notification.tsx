import { XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";

interface Props {
  message: string;
  type: "success" | "warning" | "error" | "info";
  onClose: () => void;
}

export const Notification: React.FC<Props> = ({ message, type, onClose }) => {
  const colors = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      className={`fixed top-0 right-0 mr-5 mt-5 p-4 rounded-md shadow-md ${colors[type]} flex justify-between items-center w-64`}
    >
      <p>{message}</p>
      <button className="w-8 h-8 text-black" onClick={onClose}>
        <XMarkIcon className="text-black-800" />
      </button>
    </div>
  );
};
