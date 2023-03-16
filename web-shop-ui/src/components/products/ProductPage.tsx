import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import http from "../../http";
import noimage from "../../assets/no-image.webp";
import { APP_ENV } from "../../env";
import Carousel from "../helpers/Carousel";

interface IProduct {
  name: string;
  price: string;
  description: string;
  category: string;
  images: string[];
}

export const ProductPage = () => {
  const { id } = useParams();
  const navigator = useNavigate();

  const [product, setProduct] = useState<IProduct>({
    name: "",
    price: "",
    description: "",
    category: "",
    images: [],
  });

  useEffect(() => {
    http.get("/api/products/id/" + id).then((resp) => {
      setProduct(resp.data);
    }).catch(error=>{
        navigator('/error404')
    })
  }, []);

  return (
    <div className="pt-6">
      <nav aria-label="Breadcrumb">
        <ol
          role="list"
          className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
        >
          <li>
            <div className="flex items-center">
              <Link
                to={"/products?page=1"}
                className="mr-2 text-sm font-medium text-gray-900"
              >
                Товари
              </Link>
              <svg
                width={16}
                height={20}
                viewBox="0 0 16 20"
                fill="currentColor"
                aria-hidden="true"
                className="h-5 w-4 text-gray-300"
              >
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <Link
                to={"/products?page=1&search=" + product?.category}
                className="mr-2 text-sm font-medium text-gray-900"
              >
                {product?.category}
              </Link>
              <svg
                width={16}
                height={20}
                viewBox="0 0 16 20"
                fill="currentColor"
                aria-hidden="true"
                className="h-5 w-4 text-gray-300"
              >
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
          <li className="text-sm">
            <Link
              to={""}
              aria-current="page"
              className="font-medium text-gray-500 hover:text-gray-600"
            >
              {product!.name.length > 37
                ? product!.name.substring(0, 37) + "..."
                : product!.name}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-5">
            {product?.name}
          </h1>
          <Carousel images={product.images} />
        </div>

        <div className="mt-4 lg:row-span-3 lg:mt-0">
          <p className="text-3xl tracking-tight text-gray-900">
            {product?.price} ₴
          </p>

          <form className="mt-10">
            <button
              type="submit"
              className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Добавити в корзину
            </button>
          </form>
        </div>

        <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
          <div>
            <h3 className="sr-only">Опис</h3>

            <div
              className="space-y-6"
              dangerouslySetInnerHTML={{ __html: product!.description }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
