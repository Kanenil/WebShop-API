import qs from "qs";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import GenericTable from "../../../common/table";
import { filterNonNull } from "../../../products/main/types";
import { ISaleResult, ISaleSearch } from "./types";

const countOnPage = 10;


const SalesListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<ISaleSearch>({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1,
    countOnPage: searchParams.get("countOnPage") || countOnPage,
  });
  const [data, setData] = useState<ISaleResult>({
    pages: 0,
    sales: [],
    total: 0,
    currentPage: 0,
  });

  useEffect(() => {
    http
      .get<ISaleResult>("/api/sales", {
        params: search,
      })
      .then((resp) => {
        setData(resp.data);
      });
  }, [search]);

  const deleteHandler = (id: number) => {
    console.log(id);
    
    http.delete("/api/sales/" + id).then((resp) => {
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
        tableName={"Акції"}
        list={data.sales.map((item) => {
          return {
            '#': item.id,
            'Назва': item.name,
            'Фотографія': APP_ENV.IMAGE_PATH + "100x100_" + item.image,
            'Знижка': item.decreasePercent.toLocaleString() + " %",
            'Кінець акції': new Date(item.expireTime).toUTCString(),
            'Кількість товарів': item.productCount,
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

export default SalesListPage;
