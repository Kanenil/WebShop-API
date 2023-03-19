import { ReactElement } from "react";

export interface IProductTableItem {
  id: number;
  name: string;
  price: string;
  category: string;
  images: Array<string>;
}

export interface PhotoData {
  id: string;
  url: string;
}

export type FormValues = {
  imageFile: File;
  imageUrl: string;
};

export interface ICreateProduct {
  name: string;
  description: string;
  category: number;
  price: string;
  images: Array<FormValues>;
}

export interface IEditProduct {
  name: string;
  description: string;
  category: number;
  price: string;
  images: Array<FormValues> | Array<string>;
}

export interface ICategoryValue {
  name: string;
  id: number;
}
