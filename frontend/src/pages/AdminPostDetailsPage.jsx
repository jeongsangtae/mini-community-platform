import { redirect } from "react-router-dom";

import AdminPostDetails from "../components/Admin/Posts/AdminPostDetails";

const AdminPostDetailsPage = () => {
  return <AdminPostDetails />;
};

export default AdminPostDetailsPage;

// 관리자 페이지에서 게시글 세부 페이지 로드 시 호출되는 lodaer 함수
// 관리자 페이지에서 게시글 세부 정보를 가져옴
export const loader = async ({ params }) => {
  try {
    const response = await fetch(
      "http://localhost:3000/admin/posts/" + params.postId
    );
    const resData = await response.json();

    return resData;
  } catch (error) {
    console.error("게시글 세부 내용 조회 중 오류 발생", error.message);
    alert(
      "게시글 세부 내용 조회 중에 문제가 발생했습니다. 다시 시도해 주세요. "
    );

    // null을 반환하여 페이지에 데이터가 없음을 명시
    return null;
  }
};

// 관리자 페이지에서 사용자 게시글 삭제에 호출되는 action 함수
// 관리자 페이지에서 사용자 게시글을 삭제하는 작업을 처리
export const action = async ({ request, params }) => {
  const postId = params.postId;

  try {
    // 요청 메소드 DELETE를 서버에 요청 보냄
    const response = await fetch(
      "http://localhost:3000/admin/posts1/" + postId,
      {
        method: request.method,
        credentials: "include",
      }
    );

    // 응답이 올바르지 않다면 접근 불가 페이지로 리디렉션
    if (!response.ok) {
      return redirect(`/admin/posts/${postId}/no-access`);
    }

    // 성공 시 게시글 목록 페이지로 리디렉션
    return redirect("/admin/posts");
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생", error.message);
    alert("게시글 삭제하는 중 문제가 발생했습니다. 다시 시도해 주세요.");

    // null을 반환하여 페이지에 데이터가 없음을 명시
    return null;
  }
};
