import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { AuthReducer } from "../components/auth/AuthReducer";
import { CartReducer } from "../components/common/basket/CartReducer";

export const rootReducer = combineReducers({
  auth: AuthReducer,
  shoppingCart: CartReducer
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
