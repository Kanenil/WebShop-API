import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Logout } from "./components/auth/Logout";
import AdminNavbar from "./components/containers/Layout/AdminNavbar";
import { CreateCategoryPage } from "./components/admin/categories/CreateCategoryPage";
import { EditCategoryPage } from "./components/admin/categories/EditCategoryPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { CreateProductPage } from "./components/admin/products/CreateProductPage";
import { EditProductPage } from "./components/admin/products/EditProductPage";
import { MainPage } from "./components/main/MainPage";
import { ProductPage } from "./components/products/ProductPage";
import { ConfirmEmailPage } from "./components/profile/ConfirmEmail";
import { CategoriesMainPage } from "./components/categories/CategoriesMainPage";
import ProductsMainPage from "./components/products/list";
import { Error404 } from "./components/error/Error404";
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

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<MainPage />} />
            <Route path="/auth">
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
            <Route path="/profile">
              <Route index element={<ProfilePage />} />
              <Route path="confirmEmail" element={<ConfirmEmailPage />} />
            </Route>
            <Route path="/categories">
              <Route index element={<CategoriesMainPage />} />
            </Route>
            <Route path="/products">
              <Route index element={<ProductsMainPage />} />
              <Route path=":id" element={<ProductPage />} />
            </Route>
            <Route path="*" element={<Error404 />} />
          </Route>
          <Route path="/control-panel" element={<AdminNavbar />}>
            <Route index element={<AdminHomePage />} />
            <Route path="categories">
              <Route index element={<CategoriesListPage />} />
              <Route path="create" element={<CreateCategoryPage />} />
              <Route path="edit">
                <Route path=":id" element={<EditCategoryPage />} />
              </Route>
            </Route>
            <Route path="sales">
              <Route index element={<SalesListPage />} />
              <Route path="create" element={<CreateSalePage />} />
              <Route path="edit">
                <Route path=":id" element={<EditSalePage />} />
              </Route>
            </Route>
            <Route path="products">
              <Route index element={<ProductsListPage />} />
              <Route path="create" element={<CreateProductPage />} />
              <Route path="edit">
                <Route path=":id" element={<EditProductPage />} />
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
