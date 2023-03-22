import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import qs from "qs";
import { IProductResult, IProductSearch } from "../../../products/types";
import http from "../../../../http";
import { filterNonNull } from "../../../products/main/types";
import GenericTable from "../../../common/table";
import { APP_ENV } from "../../../../env";

const countOnPage = 10;

const ProductsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<IProductSearch>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    page: searchParams.get("page") || 1,
    sort: searchParams.get("sort") || "",
    countOnPage: searchParams.get("countOnPage") || countOnPage,
  });
  const [data, setData] = useState<IProductResult>({
    pages: 0,
    products: [],
    total: 0,
    currentPage: 0,
  });

  useEffect(() => {
    http
      .get<IProductResult>("/api/products", {
        params: search,
      })
      .then((resp) => {
        setData(resp.data);
      });
  }, [search]);

  const deleteHandler = (id: number) => {
    http.delete("/api/products/" + id).then((resp) => {
      setSearch({ ...search, search: search.search });
    });
  };

  const onClickHandler = (page: number) => setSearch({ ...search, page });

  const onSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch({ ...search, search: value, page: 1 });
    setSearchParams(
      "?" + qs.stringify(filterNonNull({ ...search, search: value, page: 1 }))
    );
  };

  const onClearSearchHandler = () => {
    setSearch({ ...search, search: '', page: 1 });
    setSearchParams(
      "?" + qs.stringify(filterNonNull({ ...search, search: '', page: 1 }))
    );
  };

  const onCountOnPageHandler = (value: number) => {
    setSearch({ ...search, countOnPage: value, page: 1 });
    setSearchParams(
      "?" + qs.stringify(filterNonNull({ ...search, countOnPage: value, page: 1 }))
    );
  };

  return (
    <>
      <GenericTable
        lenght={data.total}
        tableName={"Товари"}
        list={data.products.map((item) => {
          return {
            '#': item.id,
            'Назва': item.name.substring(0, 27) + "...",
            'Ціна': item.price.toLocaleString() + " ₴",
            'Категорія': item.category,
            'Фотографія': APP_ENV.IMAGE_PATH + "100x100_" + item.images[0],
          };
        })}
        search={search}
        pages={data.pages}
        countOnPage={search.countOnPage}
        currentPage={data.currentPage}
        onSearch={onSearchHandler}
        onPageChange={onClickHandler}
        onDelete={deleteHandler}
        onClearSearch={onClearSearchHandler}
        onCountOnPageChange={onCountOnPageHandler}
      />
    </>
  );
};

export default ProductsListPage;
