import { useContext } from "react";

import PostForm from "../components/Posts/PostForm";
import AuthContext from "../store/auth-context";

const CreatePostPage = () => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      {/* HTTP 메서드로 "post"를 전송, 로그인한 사용자 정보 전달 */}
      <PostForm
        method="post"
        userData={authCtx.userInfo}
        postPageName="게시글 추가 페이지"
      />
    </>
  );
};

export default CreatePostPage;
