import React from "react";
import { Link } from "react-router-dom";
import { APP_ENV } from "../../../env";
import { IProductTableItem } from "../../admin/products/types";
import noimage from "../../../assets/no-image.webp";

interface Props {
  product: IProductTableItem;
}

export const ProductItem: React.FC<Props> = ({ product }) => {
  return (
    <div className="group relative">
      <div className="max-h-56 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md border-2 border-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80 flex justify-center items-center">
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
          <h3 className="text-sm text-gray-700">
            <Link to={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name.length > 17
                ? product.name.substring(0, 17) + "..."
                : product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">
          {product.price.toLocaleString()} ₴
        </p>
      </div>
    </div>
  );
};
