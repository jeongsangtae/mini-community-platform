import { useRouteLoaderData } from "react-router-dom";

import PostForm from "../components/Posts/PostForm";

const PostEditPage = () => {
  const postData = useRouteLoaderData("post-detail");

  console.log(postData);

  return (
    <>
      <PostForm
        method="patch"
        postData={postData}
        postPageName="게시글 수정 페이지"
      />
    </>
  );
};

export default PostEditPage;
