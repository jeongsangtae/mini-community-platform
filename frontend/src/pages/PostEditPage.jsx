import { useRouteLoaderData } from "react-router-dom";
import PostEdit from "../components/Posts/PostEdit";
import PostForm from "../components/Posts/PostForm";

const PostEditPage = () => {
  const postData = useRouteLoaderData("post-detail");
  console.log(postData);
  return (
    <>
      <PostForm method="patch" postData={postData} />
      {/* <PostEdit /> */}
    </>
  );
};

export default PostEditPage;
