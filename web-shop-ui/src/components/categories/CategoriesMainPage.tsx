import { useEffect, useState } from "react";
import http from "../../http";
import { ICategoryMenu } from "./types";
import React from "react";
import { CategoriesList } from "./CategoriesList";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">Категорії</h2>

          <div className="mt-6 gap-y-5 space-y-12 grid sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6 lg:space-y-0">
            <CategoriesList categories={categories}/>
          </div>
        </div>
      </div>
    </>
  );
};
