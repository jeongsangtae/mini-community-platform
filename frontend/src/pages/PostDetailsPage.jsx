import { redirect } from "react-router-dom";

import Authentication from "../components/Users/Authentication";

import PostDetails from "../components/Posts/PostDetails";

const PostDetailsPage = ({ isError }) => {
  if (isError) {
    return <Authentication />;
  }

  return <PostDetails />;
};

export default PostDetailsPage;

export const loader = async ({ params }) => {
  const response = await fetch("http://localhost:3000/posts/" + params.postId);
  const resData = await response.json();
  console.log(params.postId);
  return resData;
};

export const action = async ({ request, params }) => {
  const postId = params.postId;
  const response = await fetch("http://localhost:3000/posts/" + postId, {
    method: request.method,
    credentials: "include",
  });

  if (!response.ok) {
    return redirect("/no-access");
    // throw json({ message: "Could not delete post." }, { status: 500 });
  }

  console.log("action function");

  return redirect("/posts");
};
