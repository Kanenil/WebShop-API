import { useEffect, useState } from "react";
import { APP_ENV } from "../../env";
import http from "../../http";
import { CategoryItem } from "./CategoryItem";
import { ICategoryItem } from "./types";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<ICategoryItem[]>([]);

  useEffect(() => {
    http.get(`/api/categories/mainPage`).then((resp) => {
      setCategories(resp.data);
    });
  }, []);

  return (
    <>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Категорії
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {categories.map((category) => {
            category.image = `${APP_ENV.IMAGE_PATH}500x500_${category.image}`;
            return <CategoryItem key={category.name} category={category} />;
          })}
        </div>
      </div>
    </>
  );
};
export default CategoriesPage;
