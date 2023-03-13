import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import { AuthActionType } from "../types";

export const GoogleAuth = () => {
    const navigator = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = (resp: any) => {
        const token = resp!.credential as string;
        
        http.post('/api/auth/google/login', token, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((resp)=>{
          const { token } = resp.data;
            localStorage.setItem("token", token);
            http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            dispatch({type: AuthActionType.USER_LOGIN});
            navigator("/");
        }).catch((error)=>{
          navigator("/auth/register/finish/" + token);
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
