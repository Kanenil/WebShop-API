import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { PaginationReducer } from "../components/admin/categories/PaginationReducer";
import { AuthReducer } from "../components/auth/AuthReducer";

export const rootReducer = combineReducers({
  auth: AuthReducer,
  pagination: PaginationReducer
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
