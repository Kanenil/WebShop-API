import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { AuthReducer } from "../components/auth/AuthReducer";
import { PaginationReducer } from "../components/helpers/PaginationReducer";

export const rootReducer = combineReducers({
  auth: AuthReducer,
  pagination: PaginationReducer
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
