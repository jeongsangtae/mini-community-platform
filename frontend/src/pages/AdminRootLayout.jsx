import { Outlet } from "react-router-dom";
import AdminMainHeader from "../components/Admin/Main/AdminMainHeader";

const AdminRootLayout = () => {
  return (
    <>
      <AdminMainHeader />
      <Outlet />
    </>
  );
};

export default AdminRootLayout;

export const loader = async () => {
  const response = await fetch("http://localhost:3000/admin/users", {
    credentials: "include",
  });
  const resData = await response.json();
  return resData.users;
};
