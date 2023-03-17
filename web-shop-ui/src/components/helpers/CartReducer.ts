export interface ICart 
{
  isOpen: boolean;
  cart: ICartItem[];
}

export interface ICartItem 
{
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    quantity: number;
}

const initState: ICart = {
  isOpen: false,
  cart: [],
};

const cartFromLocalStorage = localStorage.getItem("cart");
if (cartFromLocalStorage) {
  initState.cart = JSON.parse(cartFromLocalStorage);
}

export enum CartActionType {
  SET_OPEN = "SET_OPEN_ACTION",
  SET_CART = "SET_CART_ACTION",
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
