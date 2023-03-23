import { useEffect, useState } from "react";
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import { IProduct, IProductResult } from "../../../products/types";
import { IProductTableItem } from "../../products/types";
import { ISaleTableItem } from "../list/types";

export interface IProductSaleItem {
  id: number;
  image: string;
  name: string;
  checked: boolean;
}

interface Props {
  id: string | undefined;
  selected: IProductSaleItem[];
  setSelected: React.Dispatch<React.SetStateAction<IProductSaleItem[]>>;
}

export const ProductList: React.FC<Props> = ({ id, selected, setSelected }) => {
  const [products, setProducts] = useState<IProductSaleItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>();

  useEffect(() => {
    async function fetchData() {
      const resp = await http.get("/api/products", {
        params: {
          page: page,
          countOnPage: 5,
        },
      });
      setPages(resp.data.pages);
      const product = resp.data.products.map((item: any) => {
        if (item.decreasePercent != 0) {
          const resp = http.get<ISaleTableItem[]>(
            "/api/sales/product-sale/" + item.id
          );

          return resp.then((saleItems) => {
            const arr = saleItems.data.filter(
              (item) => item.id === parseInt(id || "0")
            );

            if (arr.length > 0) {
              return {
                id: item.id,
                image: item.images[0],
                name: item.name,
                checked: true,
              };
            } else {
              return {
                id: item.id,
                image: item.images[0],
                name: item.name,
                checked: false,
              };
            }
          });
        } else {
          return Promise.resolve({
            id: item.id,
            image: item.images[0],
            name: item.name,
            checked: false,
          });
        }
      });

      const list = await Promise.all(product);
      list.forEach((item) => {
        let index = selected.filter((select) => {
          if (select.id == item.id) return select;
        });

        if (index.length > 0) {
          item.checked = index[0].checked;
        }
      });
      setProducts(list);
    }

    fetchData();
  }, [page]);

  const onSelectionChange = (value: boolean, item: IProductSaleItem) => {
    item.checked = value;
    let arr = selected.filter((select) => {
      if (select.id !== item.id) return item;
    });
    setSelected([...arr, item]);
  };

  const changePage = (value: number) => {
    if (page && pages && page + value > 0 && page + value <= pages)
      setPage(page + value);
  };

  return (
    <>
      <section className="container px-4 mx-auto">
        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <div className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                          />
                          <span>Назва</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {products?.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            <input
                              type="checkbox"
                              defaultChecked={item?.checked}
                              onChange={(e) =>
                                onSelectionChange(!item?.checked, item)
                              }
                              className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                            />

                            <div className="flex items-center gap-x-2">
                              <img
                                className="object-cover w-10 h-10 rounded-full"
                                src={
                                  APP_ENV.IMAGE_PATH + `100x100_${item?.image}`
                                }
                                alt=""
                              />
                              <div>
                                <h2 className="font-medium text-gray-800 dark:text-white ">
                                  {item.name?.substring(0, 20)}...
                                </h2>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => changePage(-1)}
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>

            <span>previous</span>
          </button>

          <button
            onClick={() => changePage(1)}
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <span>Next</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
};
