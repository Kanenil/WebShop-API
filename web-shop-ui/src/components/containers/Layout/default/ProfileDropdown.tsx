import { Transition } from "@headlessui/react";
import { ArrowLeftOnRectangleIcon, UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  image: string;
  name: string;
}

export const ProfileDropDown: React.FC<Props> = ({ image, name }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = () => {
        setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref]);

  return (
    <>
      <div className="relative inline-block" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center focus:outline-none"
        >
          <div className="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full">
            <img
              src={image}
              className="object-cover w-full h-full"
              alt="avatar"
            />
          </div>

          <h3 className="mx-2 text-gray-700 dark:text-gray-200 lg:hidden">
            {name}
          </h3>
        </button>
        <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
                <div className="absolute right-0 z-20 w-48 py-2 mt-2 origin-top-right bg-white rounded-md shadow-xl dark:bg-gray-800">
                <Link
                to="/profile"
                className="flex items-center px-3 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <UserIcon className="w-5 h-5 mx-1"/>

                <span className="mx-1">профіль</span>
              </Link>
              <Link
                to="/auth/logout"
                className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mx-1"/>

                <span className="mx-1">вийти</span>
              </Link>
                </div>
              
            </Transition>
      </div>
    </>
  );
};



