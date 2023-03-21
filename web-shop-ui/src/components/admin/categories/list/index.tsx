import qs from "qs";
import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import GenericTable from "../../../common/table";
import { ICategoryResult, ICategorySearch } from "./types";

const countOnPage = 10;

function filterNonNull(obj: any) {
    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));
  }

const CategoriesListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState<ICategorySearch>({
        search: searchParams.get("search") || "",
        page: searchParams.get("page") || 1,
        countOnPage: searchParams.get("countOnPage") || countOnPage,
      });
      const [data, setData] = useState<ICategoryResult>({
        pages: 0,
        categories: [],
        total: 0,
        currentPage: 0,
      });

      useEffect(() => {
        http
          .get<ICategoryResult>("/api/categories", {
            params: search,
          })
          .then((resp) => {
            setData(resp.data);
          });
      }, [search]);

      const deleteHandler = (id: number) => {
        http.delete("/api/categories/" + id).then((resp) => {
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
        tableName={"Категорії"}
        list={data.categories.map(item=>{
            return {
              '#': item.id,
                'Назва': item.name,
                'Фотографія': APP_ENV.IMAGE_PATH + "100x100_" + item.image,
              };
        })}
        search={search}
        pages={data.pages}
        currentPage={data.currentPage}
        countOnPage={search.countOnPage}
        onSearch={onSearchHandler}
        onPageChange={onClickHandler}
        onDelete={deleteHandler}
        onClearSearch={onClearSearchHandler}
        onCountOnPageChange={onCountOnPageHandler}
      />
        </>
    )
}

export default CategoriesListPage;