import { useEffect, useState } from "react";
import http from "../../http";
import noimage from "../../assets/no-image.webp";
import { APP_ENV } from "../../env";
import { Link } from "react-router-dom";
import { ICategoryMenu } from "./types";
import React from "react";

export const CategoriesMainPage = () => {
  const [categories, setCategories] = useState<Array<ICategoryMenu>>([]);

  useEffect(() => {
    http
        .get(`/api/categories/mainPage`)
        .then((resp) => {
          setCategories(resp.data);
        });
  }, []);

  return (
    <>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Категорії
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-5">
          {categories.map((category) => (
            <div key={category.name} className="group relative">
              <div className="max-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md border-2 border-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80 flex justify-center items-center">
                <img
                  src={
                    category.image
                      ? `${APP_ENV.IMAGE_PATH}500x500_${category.image}`
                      : noimage
                  }
                  alt={category.image}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link
                      to={
                        '/products?page=1&search=Категорія:"' +
                        category.name +
                        '"'
                      }
                    >
                      <span aria-hidden="true" className="absolute inset-0" />
                      {category.name.length > 27
                        ? category.name.substring(0, 27) + "..."
                        : category.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Кількість товарів: {category.countProducts}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
