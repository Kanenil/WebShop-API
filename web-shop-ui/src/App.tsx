import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Logout } from "./components/auth/Logout";
import MainPage from "./components/main/index";
import ProductsListPage from "./components/admin/products/list";
import AdminHomePage from "./components/admin/home";
import SalesListPage from "./components/admin/sales/list";
import CategoriesListPage from "./components/admin/categories/list";
import CreateSalePage from "./components/admin/sales/create";
import EditSalePage from "./components/admin/sales/edit";
import MainLayout from "./components/containers/Layout/default";
import LoginPage from "./components/auth/login";
import RegistrtrationPage from "./components/auth/register";
import GoogleRegistration from "./components/auth/finish";
import ForgotPassword from "./components/auth/forgotPassword";
import ResetPassword from "./components/auth/resetPassword";
import Error404 from "./components/error/404";
import Profile from "./components/profile";
import CategoriesPage from "./components/categories";
import ProductsMainPage from "./components/products/main";
import ProductPage from "./components/products/page";
import ControlPanelLayout from "./components/containers/Layout/admin";
import CreateCategory from "./components/admin/categories/create";
import EditCategory from "./components/admin/categories/edit";
import CreateProduct from "./components/admin/products/create";
import EditProduct from "./components/admin/products/edit";
import NewsListPage from "./components/news/list";
import OrderSummary from "./components/orders/summary";
import OrdersPage from "./components/orders/list";
import OrderPage from "./components/orders/order";
import OrdersList from "./components/admin/orders";
import UsersList from "./components/admin/users";
import SalePage from "./components/sale";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<MainPage />} />
            <Route path="auth">
              <Route path="login" element={<LoginPage />} />
              <Route path="forgotPassword" element={<ForgotPassword />} />
              <Route path="resetPassword" element={<ResetPassword />} />
              <Route path="register">
                <Route index element={<RegistrtrationPage />} />
                <Route path="finish">
                  <Route index element={<GoogleRegistration />} />
                </Route>
              </Route>
              <Route path="logout" element={<Logout />} />
            </Route>
            <Route path="profile" element={<Profile />} />
            <Route path="categories">
              <Route index element={<CategoriesPage />} />
            </Route>
            <Route path="products">
              <Route index element={<ProductsMainPage />} />
              <Route path=":id" element={<ProductPage />} />
            </Route>
            <Route path="news">
              <Route index element={<NewsListPage />}></Route>
            </Route>
            <Route path="orders">
              <Route index element={<OrdersPage/>}/>
              <Route path="make-order" element={<OrderSummary/>}/>
              <Route path=":id" element={<OrderPage />} />
            </Route>
            <Route path="sale">
              <Route path=":id" element={<SalePage/>}/>
            </Route>
            <Route path="*" element={<Error404 />} />
          </Route>
          <Route path="/control-panel" element={<ControlPanelLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="categories">
              <Route index element={<CategoriesListPage />} />
              <Route path="create" element={<CreateCategory />} />
              <Route path="edit">
                <Route path=":id" element={<EditCategory />} />
              </Route>
            </Route>
            <Route path="sales">
              <Route index element={<SalesListPage />} />
              <Route path="create" element={<CreateSalePage />} />
              <Route path="edit">
                <Route path=":id" element={<EditSalePage />} />
              </Route>
            </Route>
            <Route path="orders">
              <Route index element={<OrdersList/>}/>
            </Route>
            <Route path="users">
              <Route index element={<UsersList/>}/>
            </Route>
            <Route path="products">
              <Route index element={<ProductsListPage />} />
              <Route path="create" element={<CreateProduct />} />
              <Route path="edit">
                <Route path=":id" element={<EditProduct />} />
              </Route>
            </Route>
            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
