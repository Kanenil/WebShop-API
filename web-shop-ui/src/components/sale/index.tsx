import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { APP_ENV } from "../../env";
import http from "../../http";
import { ISaleTableItem } from "../admin/sales/list/types";
import { ProductItem } from "../products/main/ProductItem";
import { IProduct } from "../products/types";

const SalePage = () => {
  const [sale, setSale] = useState<ISaleTableItem>();
  const [products, setProducts] = useState<IProduct[]>([]);

  const { id } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    http
      .get("/api/sales/" + id)
      .then((resp) => {
        setSale(resp.data);
        http
          .get("/api/sales/products/" + id)
          .then((resp) => {
            setProducts(resp.data);
          })
          .catch((error) => {
            navigator("/error404");
          });
      })
      .catch((error) => {
        navigator("/error404");
      });
  }, []);

  return (
    <>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-center items-center">
          <img
            src={`${APP_ENV.IMAGE_PATH}1200x1200_${sale?.image}`}
            className="object-contain"
          />
        </div>

        <h2
          className={
            "text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200 mt-5"
          }
        >
          {sale?.name}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};
export default SalePage;
