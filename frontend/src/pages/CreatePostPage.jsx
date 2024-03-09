import { useLoaderData } from "react-router-dom";
import PostForm from "../components/Posts/PostForm";

const CreatePostPage = () => {
  const resData = useLoaderData();
  console.log(resData);
  console.log(resData.userData);
  return (
    <>
      <PostForm
        method="post"
        userData={resData.userData}
        postPageName="게시글 추가 페이지"
      />
    </>
  );
};

export default CreatePostPage;
