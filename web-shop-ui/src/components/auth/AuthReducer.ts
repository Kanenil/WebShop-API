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
  roles: decoded?.roles || ""
};

export const AuthReducer = (state = initState, action: any) => {
  switch (action.type) {
    case AuthActionType.USER_LOGIN:
      const dec: any = jwt(localStorage?.token);
      return {
        ...state,
        isAuth: true,
        name: dec?.name,
        email: dec?.email,
        image: dec?.image,
        roles: dec?.roles
      };
    case AuthActionType.USER_LOGOUT:
      return {
        ...state,
        isAuth: false,
        name: "",
        email: "",
        image: "",
        roles: ""
      };
  }
  return state;
};
