import { ReactElement } from "react";

export interface IProductTableItem {
  id: number;
  name: string;
  category: string;
  images: Array<string>;
}

export interface PhotoData {
  id: string;
  url: string;
}

export interface PhotoProps {
  photo: PhotoData;
  onDelete: (id: string) => void;
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
