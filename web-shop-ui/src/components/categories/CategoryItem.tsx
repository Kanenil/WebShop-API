import { Link } from "react-router-dom";
import { ICategoryItem } from "./types";

interface Props {
  category: ICategoryItem;
}

export const CategoryItem: React.FC<Props> = ({ category }) => {
  return (
    <div className="group relative">
      <div className="flex justify-center rounded-lg h-56 items-center relative overflow-hidden bg-gray-100 group-hover:opacity-75 lg:aspect-w-1 lg:aspect-h-1">
        <img
          src={category.image}
          alt={category.name}
          className="object-contain max-h-full max-w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            <Link to={"/products?category=" + category.name}>
              <span className="absolute inset-0" />
              Товарів: {category.countProducts}
            </Link>
          </h3>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {category.name}
          </p>
        </div>
      </div>
    </div>
  );
};
