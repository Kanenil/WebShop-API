export interface ISaleSearch {
    page?: number | string | null;
    search?: string;
    countOnPage?: number | string | null;
  }
  
  export interface ISaleResult {
    sales: Array<ISaleTableItem>;
    pages: number;
    currentPage: number;
    total: number;
  }

  export interface ISaleTableItem
  {
    id :number;
    name :string;
    image :string;
    description : string;
    decreasePercent : number;
    expireTime : string;
    productCount : number;
  }