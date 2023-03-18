import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  TagIcon,
} from "@heroicons/react/20/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IProductTableItem } from "../admin/products/types";
import http from "../../http";
import { APP_ENV } from "../../env";
import noimage from "../../assets/no-image.webp";
import { Pagination } from "../helpers/Pagination";


interface IFilterItem
{
  value: string; 
  label: string; 
  checked: boolean;
}

interface ISortOption
{
  name: string; 
  href: string; 
  current: boolean;
}

interface IFilter
{
  id: string;
  name: string;
  options: IFilterItem[]
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

function validateURL(url: string) {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
    url
  );
}

const countOnPage = 12;

export const ProductsMainPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Array<IProductTableItem>>([]);
  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState<string[]>([]);
  const [filters, setFilters] = useState<IFilter[]>([]);
  const [sortOptions, setSortOptions] = useState<ISortOption[]>([
    { name: "За замовчуванням", href: "", current: true },
    { name: "За алфавітом (A-Z)", href: "nameAscending", current: false },
    { name: "За алфавітом (Z-A)", href: "nameDescending", current: false },
    { name: "За спаданням ціни", href: "priceHighToLow", current: false },
    { name: "За зростанням ціни", href: "priceLowToHigh", current: false },
  ]);

  const location = useLocation();
  const navigator = useNavigate();
  

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newSearch = searchParams.get("search") || "";
    const newPage = searchParams.get("page") || "1";
    const newSort = searchParams.get("sort") || "";
    handleSearchChange(newSearch, newPage, newSort);
  }, [location.search]);

  const handleSearchChange = async (
    newSearch: string,
    newPage: string,
    newSort: string
  ) => {
    setPage(parseInt(newPage));

    const outputArray = [];
    const catArray = [];

    let remainingString = newSearch.trim();

    while (remainingString.length > 0) {
      const categoryRegex = /Категорія:"([^"]+)"/;
      const categoryMatch = remainingString.match(categoryRegex);

      if (categoryMatch) {
        catArray.push(categoryMatch[0]);
        remainingString = remainingString.replace(categoryRegex, "");
      } else {
        const remainingWords = remainingString.trim().split(/\s+/);

        for (let word of remainingWords) {
          if (word) outputArray.push(word);
        }

        remainingString = "";
      }
    }

    setSearch(outputArray);

    let filtersNew = [
      {
        id: "categories",
        name: "Категорія",
        options: [{ value: "", label: "Всі категорії", checked: false }],
      },
    ];

    await http.get(`/api/categories/mainPage`).then((resp) => {
      let { data } = resp;
      let categories: IFilterItem[] = [];
      data.forEach((element: any) => {
        categories.push({
          value: element!.name as string,
          checked: false,
          label: element!.name as string,
        });
      });
      filtersNew[0].options = filtersNew[0].options.concat(categories);
    });

    if (catArray.length == 0) {
      filtersNew[0].options[0].checked = true;
    }

    catArray.forEach((item) => {
      let valueMatch = item.match(/(?<=:)(.*)/);
      if (valueMatch) {
        let value = valueMatch[0];
        value = value.replace(/\"/g, "");

        filtersNew[0].options.forEach((opt) => {

          if (opt.value === value) {
            opt.checked = true;
          }
        });
      }
    });

    setFilters(filtersNew);
    setCategorySearch(catArray);

    sortOptions.forEach(opt=>{
      if(opt.href == newSort)
        opt.current = true;
      else 
        opt.current = false;
    });
    

    setSortOptions(sortOptions);

    http
      .get(`/api/products/count`, {
        params: {
          search: newSearch,
        },
      })
      .then((resp) => {
        setCount(resp.data);
      });

    http
      .get("/api/products", {
        params: {
          page: newPage,
          search: newSearch,
          sort: newSort,
          countOnPage: countOnPage,
        },
      })
      .then((resp) => {
        setProducts(resp.data);
      });
  };

  const onCategorySelect = (category: string, value: boolean) => {
    let newSearch = [...search];

    if (value && category) {
      newSearch = [...newSearch, `Категорія:"${category}"`];
    }
    let currentSort = sortOptions.filter(item => item.current == true);

    navigator(
      `?page=1${
        newSearch.length != 0 ? "&search=" + newSearch.toString().replace(",", " ") : ""
      }${
        (currentSort[0].href?`&sort=${currentSort[0].href}`:'')
      }`
    );

      let newFilters = filters;

      newFilters[0].options.forEach((item) => {
      if(value)
      {
        if (item.value == category) {
          item.checked = true;
        }
        else {
          item.checked = false;
        }
      }
      else
      {
        item.checked = false;
      }
    });

    setFilters(newFilters);

  };

  function handleKeyPress(event: any) {
    if (event.key === "Enter" && event.target.value) {
      let currentSort = sortOptions.filter(item => item.current == true);
      navigator(
        "?page=1" +
          (event.target.value
            ? "&search=" +
              search.toString().replace(",", " ") +
              ` ${event.target.value}`
            : "")+
            (currentSort[0].href?`&sort=${currentSort[0].href}`:'')
      );
      event.target.value = "";
    }
  }

  return (
    <>
      <div>
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs bg-white flex-col overflow-y-auto py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Фільтри
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>

                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center cursor-pointer"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      onChange={() =>
                                        onCategorySelect(
                                          option.value,
                                          !option.checked
                                        )
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
          <div>
          {search.length > 0 && (
              search.map((item) => {
                const searchFilter = search
                  .filter((searchItem) => searchItem != item)
                  .toString()
                  .replace(",", " ")
                  .concat(categorySearch.toString().replace(",", " "));
                let currentSort = sortOptions.filter(item => item.current == true);
                return (
                  <span
                    key={item}
                    className="mr-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    <TagIcon className="flex-shrink-0 -ml-0.5 mr-1.5 h-4 w-4 text-gray-400" />
                    {item}
                    <Link
                      to={
                        "?page=1" + (searchFilter && `&search=${searchFilter}`+
                        (currentSort[0].href?`&sort=${currentSort[0].href}`:'')
                        )
                      }
                    >
                      <XMarkIcon className="flex-shrink-0 ml-0.5 mr-1.5 h-4 w-4 text-gray-800" />
                    </Link>
                  </span>
                );
              })
            )}
          </div>
             

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Сортувати
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 bg-white origin-top-right rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) =>{ 
                            const searchPath = search
                            .toString()
                            .replace(",", " ")
                            .concat(categorySearch.toString().replace(",", " "));
                          
                          return (
                            <Link
                              to={`?page=1${
                                searchPath ? `&search=${searchPath}` : ""
                              }${
                                option.href ? `&sort=${option.href}` : ""
                              }`}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              {option.name}
                            </Link>
                          )}}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <input
              className="ml-5 shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Пошук"
              onKeyPress={handleKeyPress}
            />
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <div className="hidden lg:block">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                        
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}`}
                                  defaultValue={option.value}
                                  type="radio"
                                  checked={option.checked}
                                  onChange={() =>
                                    onCategorySelect(
                                      option.value,
                                      !option.checked
                                    )
                                  }
                                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600 cursor-pointer"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>

              <div className="lg:col-span-3 mt-6 grid grid-cols-1 gap-y-6 gap-x-2 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-2 mb-5">
                {products.map((product) => (
                  <div key={product.id} className="group relative">
                    <div className="max-h-56 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md border-2 border-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80 flex justify-center items-center">
                      <img
                        src={
                          product.images
                            ? validateURL(product.images[0])
                              ? product.images[0]
                              : `${APP_ENV.IMAGE_PATH}500x500_${product.images[0]}`
                            : noimage
                        }
                        alt={product.images[0]}
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <Link to={`/products/${product.id}`}>
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {product.name.length > 17
                              ? product.name.substring(0, 17) + "..."
                              : product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.category}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.price.toLocaleString()} ₴
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Pagination
              countItems={count}
              currentPage={page}
              countOnPage={countOnPage}
              url={""}
            />
          </section>
        </main>
      </div>
    </>
  );
}
