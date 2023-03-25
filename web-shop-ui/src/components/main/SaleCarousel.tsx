import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../../http";
import { ISaleResult, ISaleSearch } from "../admin/sales/list/types";
import Carousel from "../common/carousel";

const SaleCarousel = () => {
    const [search, setSearch] = useState<ISaleSearch>({
        search: "",
        page: 1,
        countOnPage: 10,
      });
      const [data, setData] = useState<ISaleResult>({
        pages: 0,
        sales: [],
        total: 0,
        currentPage: 0,
      });
      const navigator = useNavigate();

      useEffect(() => {
        http
          .get<ISaleResult>("/api/sales", {
            params: search,
          })
          .then((resp) => {
            setData(resp.data);
          });
      }, []);

      const onImageClick = (image:string)=>{
        navigator('/sale/'+ data.sales.filter(sale=>sale.image == image)[0].id);
      }

    return (
        <>
            <Carousel onClickToImage={onImageClick} clickAbleImage={true} allowAutoScroll={true} showNavigation={false} images={data.sales.map(item=>{
                return item.image
            })} />
        </>
    )
}
export default SaleCarousel;