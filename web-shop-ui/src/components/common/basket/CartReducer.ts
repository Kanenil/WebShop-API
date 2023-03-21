import Cookies  from 'js-cookie';
import http from "../../../http";
import { IProduct } from "../../products/types";
import { CartActionType, IBasketResponce, ICart, ICartItem } from "./types";

const initState: ICart = {
    isOpen: false,
    cart: [],
  };
  

  
  if(Cookies.get('token'))
  {
    http.get<IBasketResponce>("/api/account/basket", {
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
        }
    }).then((resp) => {
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
        initState.cart = list;
      });
  }
  else
  {
    const cartFromLocalStorage = localStorage.getItem("cart");
    if (cartFromLocalStorage) {
      let cart = JSON.parse(cartFromLocalStorage) as ICartItem[];
      cart.forEach(async element => {
        const resp = await http.get<IProduct>('/api/products/id/'+element.id);
        if(parseInt(resp.data.decreasePercent) != element.decreasePercent)
          element.decreasePercent = parseInt(resp.data.decreasePercent);
      });
    
      initState.cart = cart;
    }
  }

  export const CartReducer = (state = initState, action: any) => {
    switch (action.type) {
      case CartActionType.SET_OPEN:
        return {
          ...state,
          isOpen: action.payload,
        };
        case CartActionType.SET_CART:
        return {
          ...state,
          cart: action.payload,
        };
    }
    return state;
  };
  
  export const setOpen = (open: boolean) => ({
    type: CartActionType.SET_OPEN,
    payload: open,
  });
  
  export const setCart = (cart: ICartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    return {
      type: CartActionType.SET_CART,
      payload: cart,
    };
  };
  