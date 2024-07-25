import { redirect } from "react-router-dom";

import AdminPostDetails from "../components/Admin/Posts/AdminPostDetails";

const AdminPostDetailsPage = () => {
  return <AdminPostDetails />;
};

export default AdminPostDetailsPage;

export const loader = async ({ params }) => {
  const response = await fetch(
    "http://localhost:3000/admin/posts/" + params.postId
  );
  const resData = await response.json();
  return resData;
};

export const action = async ({ request, params }) => {
  const postId = params.postId;
  const response = await fetch("http://localhost:3000/admin/posts/" + postId, {
    method: request.method,
    credentials: "include",
  });

  if (!response.ok) {
    return redirect(`/admin/posts/${postId}/no-access`);
  }

  return redirect("/admin/posts");
};
