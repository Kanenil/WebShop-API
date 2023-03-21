export interface ICreateSale {
    name: string;
    image: string;
    description: string;
    decreasePercent: number;
    expireTime: string;
  }
  
  export interface IFile {
    file: File;
    url: string;
  }