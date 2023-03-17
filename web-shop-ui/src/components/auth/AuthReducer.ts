import jwt from "jwt-decode";
import http from "../../http";
import { AuthActionType, IAuthUser } from "./types";

const decoded: any =
  localStorage.token != undefined ? jwt(localStorage?.token) : undefined;

http.defaults.headers.common.Authorization = `Bearer ${localStorage?.token}`;

const initState: IAuthUser = {
  isAuth: decoded != undefined,
  name: decoded?.name || "",
  email: decoded?.email || "",
  image: decoded?.image || "",
  roles: decoded?.roles || "",
  emailConfirmed: decoded?.emailConfirmed.toLowerCase() === "true" || false,
};

export const AuthReducer = (state = initState, action: any) => {
  switch (action.type) {
    case AuthActionType.USER_LOGIN:
      const dec: any = jwt(localStorage?.token);
      console.log(dec);
      
      return {
        ...state,
        isAuth: true,
        name: dec?.name,
        email: dec?.email,
        image: dec?.image,
        roles: dec?.roles,
        emailConfirmed: dec?.emailConfirmed.toLowerCase() === "true",
      };
    case AuthActionType.USER_LOGOUT:
      return {
        ...state,
        isAuth: false,
        name: "",
        email: "",
        image: "",
        roles: "",
        emailConfirmed: false,
      };
  }
  return state;
};
