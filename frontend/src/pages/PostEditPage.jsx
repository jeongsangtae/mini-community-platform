import { useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import PostForm from "../components/Posts/PostForm";
import AuthContext from "../store/auth-context";

const PostEditPage = () => {
  const authCtx = useContext(AuthContext);
  const postData = useRouteLoaderData("post-detail");

  console.log(postData);

  // if (postData.email === authCtx.userInfo?.email) {

  // }

  return (
    <>
      {postData.email === authCtx.userInfo?.email && (
        <PostForm
          method="patch"
          postData={postData}
          postPageName="게시글 수정 페이지"
        />
      )}
    </>
  );
};

export default PostEditPage;
