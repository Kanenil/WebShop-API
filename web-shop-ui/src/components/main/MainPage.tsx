import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APP_ENV } from "../../env";
import http from "../../http";
import noimage from "../../assets/no-image.webp";
import { IProduct } from "../products/types";

function validateURL(url: string) {
    return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      url
    );
  }

export const MainPage = () => {
    const [products, setProducts] = useState<Array<IProduct>>([]);

    useEffect(() => {
  
      http.get('/api/products/most-buys', {
        params: {
          'count': 4
        }
      }).then((resp) => {
        setProducts(resp.data);
      });
    }, [])
    
  
    return (
      <>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Популярне серед покупців
          </h2>
  
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md border-2 border-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80 flex justify-center items-center">
                  <img
                    src={product.images
                      ? validateURL(product.images[0])
                        ? product.images[0]
                        : `${APP_ENV.IMAGE_PATH}1200x1200_${product.images[0]}`
                      : noimage}
                    alt={product.images[0]}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name.length > 27?product.name.substring(0, 27)+"...":product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  </div>
                  {product.decreasePercent?(
            <div>
            <p className="text-xs tracking-tight text-gray-900 line-through">
            {product?.price.toLocaleString()} ₴
          </p>
          <p className="text-sm font-medium text-red-500">
            {(parseFloat(product?.price) - (parseFloat(product?.price) * parseFloat(product?.decreasePercent))/100).toLocaleString()} ₴
          </p>
            </div>
          ):(
<p className="text-sm font-medium text-gray-900">
            {product?.price.toLocaleString()} ₴
          </p>
          )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };