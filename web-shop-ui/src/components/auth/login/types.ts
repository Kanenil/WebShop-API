import { ReactElement } from "react";

declare global {
  interface Window {
    google: any;
    [key: string]: any;
  }
}

export interface ILoginUser {
  email: string;
  password: string;
}
