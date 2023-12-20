import PostDetails from "../components/Posts/PostDetails";

const PostDetailsPage = () => {
  return <PostDetails />;
};

export default PostDetailsPage;

export const loader = async ({ params }) => {
  const response = await fetch("http://localhost:3000/posts/" + params.postId);
  const resData = await response.json();
  console.log(params.postId);
  return resData;
};
