import { redirect } from "react-router-dom";

import PostDetails from "../components/Posts/PostDetails";

const PostDetailsPage = () => {
  return <PostDetails />;
};

export default PostDetailsPage;

// 게시글 페이지에서 세부 페이지 로드 시 호출되는 loader 함수
// 게시글 세부 정보를 가져옴
export const loader = async ({ params }) => {
  try {
    const response = await fetch(
      "http://localhost:3000/posts/" + params.postId
    );

    if (!response.ok) {
      throw new Error("게시글 조회 실패");
    }

    const resData = await response.json();

    console.log(params.postId);

    return resData;
  } catch (error) {
    console.error("에러 내용:", error.message);
    alert(
      "게시글을 불러오는 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
    );

    // null을 반환하여 페이지에 데이터가 없음을 명시
    return null;
  }
};

// 게시글 삭제에 호춤되는 action 함수
// 게시글을 삭제하는 작업을 처리
export const action = async ({ request, params }) => {
  const postId = params.postId;

  try {
    // 요청 메소드 DELETE를 서버에 요청 보냄
    const response = await fetch("http://localhost:3000/posts/" + postId, {
      method: request.method,
      credentials: "include",
    });

    // 응답이 올바르지 않다면 접근 불가 페이지로 리디렉션
    if (!response.ok) {
      return redirect(`/posts/${postId}/no-access`);
      // throw new Error("게시글 삭제 실패")
    }

    // 성공 시 게시글 목록 페이지로 리디렉션
    return redirect("/posts");
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생", error.message);
    alert(
      "게시글 삭제 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
    );

    // null을 반환하여 페이지에 데이터가 없음을 명시
    return null;
  }
};
