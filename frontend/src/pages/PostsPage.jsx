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
  try {
    const response = await fetch("http://localhost:3000/posts");
    const resData = await response.json();
    return resData;
  } catch (error) {
    console.error("에러 발생:", error);
    return null; // 또는 적절한 에러 처리
  }
};
