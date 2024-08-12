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
  const response = await fetch("http://localhost:3000/admin/posts", {
    credentials: "include",
  });
  const resData = await response.json();
  return resData;
};
