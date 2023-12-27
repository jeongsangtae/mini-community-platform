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
  const response = await fetch("http://localhost:3000/posts");
  const resData = await response.json();
  console.log(resData.posts);
  console.log(resData.page);
  console.log(resData.totalPages);
  console.log(resData.firstPageGroup);
  console.log(resData.lastPageGroup);
  return resData;
};
