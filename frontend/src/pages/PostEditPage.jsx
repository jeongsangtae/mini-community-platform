import { useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import PostForm from "../components/Posts/PostForm";
import NoAccess from "../components/Users/NoAccess";
import AuthContext from "../store/auth-context";

const PostEditPage = () => {
  const authCtx = useContext(AuthContext);
  const postData = useRouteLoaderData("post-detail");

  console.log(postData);

  return (
    <>
      {/* {postData.email === authCtx.userInfo?.email ? ( */}
      <PostForm
        method="patch"
        postData={postData}
        postPageName="게시글 수정 페이지"
      />
      {/* ) : (
        <NoAccess
          message={{
            title: "접근 권한이 없습니다",
            description: "해당 게시글을 작성한 사용자만 수정할 수 있습니다.",
          }}
        />
      )} */}
    </>
  );
};

export default PostEditPage;
