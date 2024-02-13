import { useRouteLoaderData } from "react-router-dom";
import PostForm from "../components/Posts/PostForm";

const PostEditPage = () => {
  const postData = useRouteLoaderData("post-detail");
  console.log(postData);
  return (
    <>
      <PostForm method="patch" postData={postData} />
    </>
  );
};

export default PostEditPage;
