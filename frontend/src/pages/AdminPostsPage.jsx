import AdminPosts from "../components/Admin/AdminPosts";

const AdminPostsLayout = () => {
  return (
    <>
      <AdminPosts />
    </>
  );
};

export default AdminPostsLayout;

export const loader = async () => {
  const response = await fetch("http://localhost:3000/posts", {
    credentials: "include",
  });
  const resData = await response.json();
  return resData;
};
