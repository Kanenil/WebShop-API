import { APP_ENV } from "../../../env";
import { ICartItem } from "../../common/basket/types";
import noimage from "../../../assets/no-image.webp";
import { Link } from "react-router-dom";

interface Props {
  product: ICartItem;
}

export const OrderProductItem: React.FC<Props> = ({ product }) => {
  return (
    <>
      <div className="flex flex-col rounded-lg bg-white dark:bg-gray-900 sm:flex-row">
        <div className="flex justify-center items-center m-2 h-24 w-24 aspect-w-1 rounded-md border dark:bg-gray-100">
          <img
            className="object-contain max-h-full max-w-full"
            src={
              product.image
                ? APP_ENV.IMAGE_PATH + "300x300_" + product.image
                : noimage
            }
            alt=""
          />
        </div>

        <div className="flex w-full flex-col px-4 py-4">
          <Link
            to={"/products/" + product.id}
            className="font-semibold dark:text-white"
          >
            {product.name.length > 36
              ? product.name.substring(0, 36) + "..."
              : product.name}
          </Link>
          <span className="float-right text-gray-400">{product.category}</span>
          {product.decreasePercent > 0 ? (
            <>
              <p className="text-sm line-through dark:text-gray-200">
                {(product.quantity * product.price).toLocaleString()} ₴
              </p>
              <p className="text-red-500 font-semibold dark:font-bold">
                {(
                  product.quantity * product.price -
                  ((product.price * product.decreasePercent) / 100) *
                    product.quantity
                ).toLocaleString()}{" "}
                ₴
              </p>
            </>
          ) : (
            <p className="font-semibold dark:text-gray-200">
              {(product.quantity * product.price).toLocaleString()} ₴
            </p>
          )}
          <p className="text-sm dark:text-gray-300">
            Кількість: {product.quantity}
          </p>
        </div>
      </div>
    </>
  );
};
