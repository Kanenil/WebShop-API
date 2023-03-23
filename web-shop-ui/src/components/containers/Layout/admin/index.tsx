import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { IAuthUser } from "../../../auth/types";
import { AdminMenu } from "./AdminMenu";

const ControlPanelLayout = () => {
  const { isAuth, roles } = useSelector((store: any) => store.auth as IAuthUser);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth ) 
      navigate("/auth/login");
    else if(!roles.toLowerCase().includes('admin'))
      navigate("/");
  }, []);
  return (
    <>
      <div className="grid grid-cols-5 lg:grid-cols-8 dark:bg-gray-800">
        <AdminMenu />
        <div className="p-4 py-8 lg:col-span-7 col-span-4 min-h-screen flex items-center">
          {(isAuth && roles.toLowerCase().includes('admin')) && <Outlet />}
        </div>
      </div>
    </>
  );
};
export default ControlPanelLayout;
