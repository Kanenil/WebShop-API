import { Link } from "react-router-dom";
import { APP_ENV } from "../../env";
import { ICategoryMenu } from "./types";

interface Props
{
    categories: ICategoryMenu[];
}

export const CategoriesList : React.FC<Props> = ({categories})=>{

    return (
        <>
        {categories.map((category) => (
              <div key={category.name} className="group relative">
                <div className="flex justify-center items-center relative overflow-hidden bg-gray-100 group-hover:opacity-75 lg:aspect-w-1 lg:aspect-h-1">
                  <img
                    src={APP_ENV.IMAGE_PATH + "1200x1200_"+category.image}
                    alt={category.image}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
                <h3 className="mt-6 text-sm text-gray-500">
                  <Link to={"/products?category="+category.name}>
                    <span className="absolute inset-0" />
                    Товарів: {category.countProducts}
                  </Link>
                </h3>
                <p className="text-base font-semibold text-gray-900">{category.name}</p>
              </div>
            ))}
        </>
    )
}