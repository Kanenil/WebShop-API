import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { setUser } from "./AuthReducer";

export const Logout = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (Cookies.get("token")) {
      Cookies.remove("token");
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
    }
    navigator("/");
  }, []);

  return <></>;
};
