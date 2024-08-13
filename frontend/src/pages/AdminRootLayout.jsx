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

// 관리자 페이지 로드 시 호출되는 loader 함수
// 관리자 페이지에서 사용자 목록을 서버에서 가져옴
// 관리자 페이지에서 사용자 목록을 가져오는 이유는 채팅 관련 내용에 사용되기 때문임
export const loader = async () => {
  const response = await fetch("http://localhost:3000/admin/users", {
    credentials: "include",
  });
  const resData = await response.json();
  return resData.users;
};
