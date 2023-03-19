import { Link } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import { IProductTableItem } from "../types";
import { ProductDeleteDialog } from "./ProductDeleteDialog";
import noimage from "../../../../assets/no-image.webp";

interface Props {
  products: IProductTableItem[];
  onDelete: (id: number) => void;
}

export const ProductTable: React.FC<Props> = ({ products, onDelete }) => {
  return (
    <>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((item) => (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {item.id}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {item.name.length > 50
                  ? item.name.substring(0, 50) + "..."
                  : item.name}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {item.category}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {item.price.toLocaleString()} ₴
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex-shrink-0 h-10 w-10">
                <img
                  className="h-10 w-10 rounded-full"
                  src={
                    item.images[0]
                      ? `${APP_ENV.IMAGE_PATH}100x100_${item.images[0]}`
                      : noimage
                  }
                />
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Link
                to={"edit/" + item.id}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Редагувати
              </Link>
              <ProductDeleteDialog
                title={"Видалення товару"}
                description={`Ви дійсно бажаєте видалити "${item.name}?"`}
                onSubmit={() => onDelete(item.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};
