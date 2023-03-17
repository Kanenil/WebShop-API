import React from "react";
import Header from "./components/containers/Layout";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/auth/login";
import { RegisterPage } from "./components/auth/register/RegisterPage";
import { GoogleRegisterPage } from "./components/auth/register/GoogleRegisterPage";
import { Logout } from "./components/auth/Logout";
import Error404 from "./components/error";
import AdminNavbar from "./components/containers/Layout/AdminNavbar";
import { CategoriesListPage } from "./components/admin/categories/CategoriesListPage";
import { CreateCategoryPage } from "./components/admin/categories/CreateCategoryPage";
import { EditCategoryPage } from "./components/admin/categories/EditCategoryPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { ProductsListPage } from "./components/admin/products/ProductsListPage";
import { CreateProductPage } from "./components/admin/products/CreateProductPage";
import { EditProductPage } from "./components/admin/products/EditProductPage";
import { ProductsMainPage } from "./components/products/ProductsMainPage";
import { MainPage } from "./components/main/MainPage";
import { ProductPage } from "./components/products/ProductPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/auth/ResetPasswordPage";
import { ConfirmEmailPage } from "./components/profile/ConfirmEmail";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<MainPage />} />
            <Route path="/auth">
              <Route path="login" element={<LoginPage />} />
              <Route path="forgotPassword" element={<ForgotPasswordPage />} />
              <Route path="resetPassword" element={<ResetPasswordPage />} />
              <Route path="register">
                <Route index element={<RegisterPage />} />
                <Route path="finish">
                  <Route path=":token" element={<GoogleRegisterPage />} />
                </Route>
              </Route>
              <Route path="logout" element={<Logout />} />
            </Route>
            <Route path="/profile">
              <Route index element={<ProfilePage />} />
              <Route path="confirmEmail" element={<ConfirmEmailPage />} />
            </Route>
            <Route path="/products">
              <Route index element={<ProductsMainPage />} />
              <Route path=":id" element={<ProductPage/>}/>
            </Route>
            <Route path="*" element={<Error404 />} />
          </Route>
          <Route path="/control-panel" element={<AdminNavbar />}>
            <Route path="categories">
              <Route index element={<CategoriesListPage />} />
              <Route path="create" element={<CreateCategoryPage />} />
              <Route path="edit">
                <Route path=":id" element={<EditCategoryPage />} />
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
