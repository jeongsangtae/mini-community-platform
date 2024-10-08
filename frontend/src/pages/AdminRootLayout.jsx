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
  const apiURL = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${apiURL}/admin/users`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("사용자 목록 조회 실패");
    }

    const resData = await response.json();

    return resData.users;
  } catch (error) {
    console.error("에러 내용:", error.message);
    alert(
      "사용자 목록을 불러오는 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
    );

    // null을 반환하여 페이지에 데이터가 없음을 명시
    return null;
  }
};
