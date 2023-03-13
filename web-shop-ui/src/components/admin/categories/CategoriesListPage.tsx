import { ChangeEvent, useEffect, useState } from "react";
import http from "../../../http";
import { ICategoryItem, IPagination, PaginationActionType } from "./types";
import noimage from "../../../assets/no-image.webp";
import { Link, useLocation } from "react-router-dom";
import { Pagination } from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export const CategoriesListPage = () => {
  const [categories, setCategories] = useState<Array<ICategoryItem>>([]);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)

  const dispatch = useDispatch();

  const { currentPage, searchBy } = useSelector(
    (store: any) => store.pagination as IPagination
  );

  const deleteHandler = () => {
    http.delete('/api/categories/' + deleteId).then(resp => {
      http.get("/api/categories").then((resp) => {
        setCategories(resp.data);
      });
    });
  }

  const [search, setSearch] = useState<string>(searchBy ? searchBy : "");

  const countOnPage = 5;

  const location = useLocation();

  useEffect(() => {
    http.get("/api/categories").then((resp) => {
      setCategories(resp.data);
    });

    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page");
    const pageInt = page ? parseInt(page) : 0;

    if (pageInt != currentPage) {
      localStorage.setItem(
        "currentPage",
        pageInt != 0 ? pageInt.toString() : "1"
      );
      dispatch({ type: PaginationActionType.CURRENT_PAGE_CHANGED });
    }
  }, []);

  const OnSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    localStorage.setItem("searchBy", e.target.value);
    dispatch({ type: PaginationActionType.SEARCH_CHANGED });
  };


  let itemsCount: number = 0;

  const content = categories
    .filter((item) => {
      if (searchBy == "") {
        itemsCount++;
        return item;
      }
      if (
        searchBy &&
        (item.name.includes(searchBy) || item.id.toString() === searchBy)
      ) {
        itemsCount++;
        return item;
      }
    })
    .slice((currentPage - 1) * countOnPage) //Skip
    .slice(0, countOnPage) //Take
    .map((item) => (
      <tr key={item.id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{item.id}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{item.name}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={item.image ? item.image : noimage}
            />
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Link
            to={"edit/" + item.id}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Edit
          </Link>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{setDeleteId(item.id);
           setOpen(true);}}>
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <>
     <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Видалити категорію?
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Ви дійсно хочете видалити цю категорію?
                          Ви будете мати можливість відновити ці дані в майбутньому.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => {setOpen(false); deleteHandler();}}
                  >
                    Видалити
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Відмінити
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
      <div className="flex justify-between items-center py-4 px-6 bg-gray-100">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Додати
        </button>
        <div className="flex items-center">
          <input
            onChange={OnSearchHandler}
            value={search}
            type="text"
            className="border-2 leading-tight border-gray-400 rounded px-4 py-2"
            placeholder="Пошук..."
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      NAME
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      IMAGE
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {content}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Pagination
          countItems={itemsCount}
          currentPage={currentPage}
          countOnPage={countOnPage}
          url={""}
        />
      </div>
    </>
  );
};