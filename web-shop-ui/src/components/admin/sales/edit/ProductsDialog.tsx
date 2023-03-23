import { Dialog, Transition } from "@headlessui/react";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { Fragment, useRef, useState } from "react";
import http from "../../../../http";
import { IProductSaleItem, ProductList } from "./ProductList";

interface Props {
  id: string | undefined;
}

export const ProductsDialog: React.FC<Props> = ({ id }) => {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [selected, setSelected] = useState<IProductSaleItem[]>([]);

  const onSubmit = async () => {
    await selected.forEach(async (element) => {
      if (element.checked) {
        await http.post("/api/sales/add-product", {
          product: element.id,
          sale: id,
        });
      } else {
        await http.put("/api/sales/remove-product", {
          product: element.id,
          sale: id,
        });
      }
    });

    setOpen(false);
  };

  return (
    <>
    <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="lg:col-span-1 sm:col-span-2 flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  <span>Товари </span>

                  <ArchiveBoxIcon className="w-5 h-5 rtl:-scale-x-100" />
                </button>
      <div className="relative flex justify-center">
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            initialFocus={cancelButtonRef}
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition duration-300 ease-out"
              enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
              enterTo="translate-y-0 opacity-100 sm:scale-100"
              leave="transition duration-150 ease-in"
              leaveFrom="translate-y-0 opacity-100 sm:scale-100"
              leaveTo="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
            >
              <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <span
                  className="hidden sm:inline-block sm:h-screen sm:align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <Dialog.Panel className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
                    id="modal-title"
                  >
                    Добавити товари
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Виберіть товари, для яких буде ця акція
                  </p>

                  <ProductList
                    selected={selected}
                    setSelected={setSelected}
                    id={id}
                  />

                  <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                    <button
                      onClick={() => setOpen(false)}
                      type="button"
                      className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                    >
                      Скасувати
                    </button>

                    <button
                      onClick={onSubmit}
                      type="button"
                      className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                    >
                      Зберегти
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
};
