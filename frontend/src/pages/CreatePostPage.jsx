import { useContext } from "react";

import PostForm from "../components/Posts/PostForm";
import AuthContext from "../store/auth-context";

const CreatePostPage = () => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <PostForm
        method="post"
        userData={authCtx.userInfo}
        postPageName="게시글 추가 페이지"
      />
    </>
  );
};

export default CreatePostPage;
