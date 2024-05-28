import AdminPosts from "../components/Admin/AdminPosts";

const AdminPostsPage = () => {
  return (
    <>
      <AdminPosts />
    </>
  );
};

export default AdminPostsPage;

export const loader = async () => {
  const response = await fetch("http://localhost:3000/admin/posts", {
    credentials: "include",
  });
  const resData = await response.json();
  return resData;
};
