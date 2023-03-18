import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import Cookies from "js-cookie";
import jwt from "jwt-decode";
import { setUser } from "../AuthReducer";

export const GoogleAuth = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (resp: any) => {
    const token = resp!.credential as string;

    http
      .post("/api/auth/google/login", token, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((resp) => {
        const { token } = resp.data;
        const decodedToken = jwt(token) as any;
        const expirationDate = new Date(decodedToken.exp * 1000);
        Cookies.set("token", token, { expires: expirationDate });
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        dispatch(
          setUser({
            isAuth: true,
            name: decodedToken?.name,
            email: decodedToken?.email,
            image: decodedToken?.image,
            roles: decodedToken?.roles,
            emailConfirmed:
              decodedToken?.emailConfirmed.toLowerCase() === "true",
          })
        );
        navigator("/");
      })
      .catch((error) => {
        navigator("/auth/register/finish?token=" + token);
      });
  };

  useEffect(() => {
    window.google.accounts!.id.initialize({
      client_id: APP_ENV.GOOGLE_CLIENT_ID,
      callback: handleLogin,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      {
        theme: "outline",
        size: "large",
        type: "icon",
      }
    );
  }, []);

  return (
    <>
      <div id="googleButton"></div>
    </>
  );
};
