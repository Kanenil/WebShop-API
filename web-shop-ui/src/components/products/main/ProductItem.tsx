import React from "react";
import { Link } from "react-router-dom";
import { APP_ENV } from "../../../env";
import noimage from "../../../assets/no-image.webp";
import { IProduct } from "../types";

interface Props {
  product: IProduct;
}

export const ProductItem: React.FC<Props> = ({ product }) => {
  return (
    <div className="group relative">
      <div className="max-h-60 h-56 aspect-w-1 dark:bg-gray-100 aspect-h-1 w-full overflow-hidden rounded-md border-2 border-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80 flex justify-center items-center">
        <img
          src={
            product.images[0]
              ? `${APP_ENV.IMAGE_PATH}500x500_${product.images[0]}`
              : noimage
          }
          alt={product.images[0]}
          className="object-contain max-h-full max-w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 dark:text-white">
            <Link to={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name.length > 17
                ? product.name.substring(0, 17) + "..."
                : product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            {product.category}
          </p>
        </div>
        {product.decreasePercent ? (
          <div>
            <p className="text-xs tracking-tight text-gray-900 dark:text-gray-300 line-through">
              {product?.price.toLocaleString()} ₴
            </p>
            <p className="text-sm font-medium text-red-500">
              {(
                parseFloat(product?.price) -
                (parseFloat(product?.price) *
                  parseFloat(product?.decreasePercent)) /
                  100
              ).toLocaleString()}{" "}
              ₴
            </p>
          </div>
        ) : (
          <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
            {product?.price.toLocaleString()} ₴
          </p>
        )}
      </div>
    </div>
  );
};
