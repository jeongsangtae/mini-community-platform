import { Outlet } from "react-router-dom";
import AdminMainHeader from "../components/Admin/AdminMainHeader";

const AdminRootLayout = () => {
  return (
    <>
      <AdminMainHeader />
      <Outlet />
    </>
  );
};

export default AdminRootLayout;
