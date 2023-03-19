import React from "react";
import { IProductTableItem } from "../../admin/products/types";
import { ProductItem } from "./ProductItem";

interface Props {
  products: IProductTableItem[];
}

export const ProductsList: React.FC<Props> = ({ products }) => {
  return (
    <div className="lg:col-span-3 mt-6 grid grid-cols-1 gap-y-6 gap-x-2 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-2 mb-5">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};
