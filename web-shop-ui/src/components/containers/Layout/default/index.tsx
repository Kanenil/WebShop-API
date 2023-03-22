import { Outlet } from "react-router-dom";
import Cart from "../../../common/basket";
import { MainHeader } from "./MainHeader";
import { MainFooter } from "./MainFooter";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen justify-between dark:bg-gray-800">
      <MainHeader/>
      <main className="dark:bg-gray-800">
        <Outlet />
      </main>
      <Cart />
      <MainFooter/>
    </div>
  );
};
export default MainLayout;
