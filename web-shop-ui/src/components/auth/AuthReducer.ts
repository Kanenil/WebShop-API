import jwt from "jwt-decode";
import http from "../../http";
import Cookies from "js-cookie";
import { AuthActionType, IAuthUser } from "./types";
import { IBasketResponce, ICartItem } from "../common/basket/types";
import { setCart } from "../common/basket/CartReducer";
import { useDispatch } from "react-redux";

const savedToken = Cookies.get("token");

const decoded: any = savedToken != undefined ? jwt(savedToken) : undefined;

http.defaults.headers.common.Authorization = `Bearer ${savedToken}`;

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
    case AuthActionType.SET_USER:
      return {
        ...state,
        isAuth: action.payload.isAuth,
        name: action.payload.name,
        email: action.payload.email,
        image: action.payload.image,
        roles: action.payload.roles,
        emailConfirmed: action.payload.emailConfirmed,
      };
  }
  return state;
};

export const setUser = (user: IAuthUser) => {
  return {
    type: AuthActionType.SET_USER,
    payload: user,
  };
};
