import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import Cookies from "js-cookie";
import jwt from "jwt-decode";
import { setUser } from "../AuthReducer";
import { IBasketResponce, ICartItem } from "../../common/basket/types";
import { setCart } from "../../common/basket/CartReducer";

interface Props
{
  onErrorLogin: (message: string)=>void;
}

export const GoogleAuth : React.FC<Props>= ({onErrorLogin}) => {
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
        const cartFromLocalStorage = localStorage.getItem("cart");
        if (cartFromLocalStorage) {
          let cart = JSON.parse(cartFromLocalStorage) as ICartItem[];

          cart.forEach((item) => {
            http.put("/api/account/basket", {
              productId: item.id,
              count: item.quantity,
            });
          });
        }

        http.get<IBasketResponce>("/api/account/basket").then((resp) => {
          const { data } = resp;
          const list = data.list.map((item) => {
            const cartItem: ICartItem = {
              id: item.product.id,
              name: item.product.name,
              category: item.product.category,
              price: parseFloat(item.product.price),
              image: item.product.images[0],
              quantity: item.count,
              decreasePercent: parseInt(item.product.decreasePercent),
            };
            return cartItem;
          });

          dispatch(setCart(list));
        });

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
        if(error.response.data !== 'Токен авторизації застарілий' && !error.response.data.includes('заблоковано'))
          navigator("/auth/register/finish?token=" + token);
        else
          onErrorLogin(error.response.data);
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
        theme: "filled_black",
        size: "medium",
        type: "standard",
        width: 380,
      }
    );
  }, []);

  return (
    <>
      <div
        className="flex items-center justify-center mt-4"
        id="googleButton"
      ></div>
    </>
  );
};
