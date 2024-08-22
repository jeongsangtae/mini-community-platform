import AdminPosts from "../components/Admin/Posts/AdminPosts";

const AdminPostsPage = () => {
  return (
    <>
      <AdminPosts />
    </>
  );
};

export default AdminPostsPage;

// 관리자 페이지 로드 시 호출되는 loader 함수
// 관리자 페이지에서 게시글 목록을 가져옴
export const loader = async () => {
  try {
    const response = await fetch("http://localhost:3000/admin/posts", {
      credentials: "include",
    });

    const resData = await response.json();

    return resData;
  } catch (error) {
    console.error("게시글 목록 조회 중 오류 발생", error.message);
    alert("게시글 목록 조회 중에 문제가 발생했습니다. 다시 시도해 주세요.");

    // null을 반환하여 페이지에 데이터가 없음을 명시
    return null;
  }
};
