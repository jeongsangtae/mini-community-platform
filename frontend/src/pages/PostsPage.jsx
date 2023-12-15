import { Outlet } from "react-router-dom";
import Posts from "../components/Posts/Posts";

const PostsPage = () => {
  return (
    <>
      <Posts />
      <Outlet />
    </>
  );
};

export default PostsPage;

export const loader = async () => {
  const response = await fetch("http://localhost:5173/posts");
  const resData = await response.json();
  return resData.posts;
};
