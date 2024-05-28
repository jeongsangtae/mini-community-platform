import { redirect } from "react-router-dom";

import AdminPostDetails from "../components/Admin/AdminPostDetails";

const AdminPostDetailsPage = () => {
  return <AdminPostDetails />;
};

export default AdminPostDetailsPage;

export const loader = async ({ params }) => {
  const response = await fetch(
    "http://localhost:3000/admin/posts/" + params.postId
  );
  const resData = await response.json();
  console.log(params.postId);
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
    // throw json({ message: "Could not delete post." }, { status: 500 });
  }

  console.log("action function");

  return redirect("/admin/posts");
};
