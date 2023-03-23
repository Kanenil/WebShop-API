import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { setUser } from "./AuthReducer";
import { setCart } from "../common/basket/CartReducer";

export const Logout = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    if (Cookies.get("token")) {
      Cookies.remove("token");
      localStorage.setItem("cart", JSON.stringify([]));
      dispatch(
        setUser({
          isAuth: false,
          name: "",
          email: "",
          image: "",
          roles: "",
          emailConfirmed: false,
        })
      );
      dispatch(
        setCart([])
      );
    }
    navigator("/");
  },[Cookies.get("token")])

  return <></>;
};
