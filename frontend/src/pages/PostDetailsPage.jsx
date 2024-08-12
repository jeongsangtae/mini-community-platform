import { redirect } from "react-router-dom";

import PostDetails from "../components/Posts/PostDetails";

const PostDetailsPage = () => {
  return <PostDetails />;
};

export default PostDetailsPage;

// 게시글 페이지에서 세부 페이지 로드 시 호출되는 loader 함수
// 게시글 세부 정보를 가져옴
export const loader = async ({ params }) => {
  const response = await fetch("http://localhost:3000/posts/" + params.postId);
  const resData = await response.json();
  console.log(params.postId);
  return resData;
};

// 게시글 삭제, 수정에 호춤되는 action 함수
// 게시글을 삭제하거나 수정하는 등의 작업을 처리
export const action = async ({ request, params }) => {
  const postId = params.postId;

  // 요청 메소드(DELETE, PATCH 등)에 따라 서버에 요청을 보냄
  const response = await fetch("http://localhost:3000/posts/" + postId, {
    method: request.method,
    credentials: "include",
  });

  // 응답이 올바르지 않다면 접근 불가 페이지로 리디렉션
  if (!response.ok) {
    return redirect(`/posts/${postId}/no-access`);
  }

  // 성공 시 게시글 목록 페이지로 리디렉션
  return redirect("/posts");
};
