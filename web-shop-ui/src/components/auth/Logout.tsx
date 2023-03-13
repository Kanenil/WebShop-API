import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthActionType } from "./types";

export const Logout = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("token");
    dispatch({ type: AuthActionType.USER_LOGOUT });
    navigator("/");
  }, []);

  return <></>;
};
