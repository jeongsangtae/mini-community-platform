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

// 페이지 로드 시 호출되는 loader 함수
// 게시글 목록을 가져옴
export const loader = async () => {
  const response = await fetch("http://localhost:3000/posts", {
    credentials: "include",
  });
  const resData = await response.json();
  return resData;
};
