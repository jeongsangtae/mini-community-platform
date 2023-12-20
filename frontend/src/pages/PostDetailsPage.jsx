import PostDetails from "../components/Posts/PostDetails";

const PostDetailsPage = () => {
  return <PostDetails />;
};

export default PostDetailsPage;

export const loader = async ({ params }) => {
  const response = await fetch("http://localhost:3000/posts/" + params.id);
  const resData = await response.json();
  console.log(params.id);
  return resData;
};
