import { useRouteLoaderData } from "react-router-dom";

import PostForm from "../components/Posts/PostForm";

const PostEditPage = () => {
  const postData = useRouteLoaderData("post-detail");

  return (
    <>
      {/* HTTP 메서드로 "patch"를 전송, 로그인한 사용자 정보 전달 */}
      <PostForm
        method="patch"
        postData={postData}
        postPageName="게시글 수정 페이지"
      />
    </>
  );
};

export default PostEditPage;
