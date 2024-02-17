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

export const action = async ({ params }) => {
  const postId = params.postId;
  const response = await fetch("http://localhost:3000/posts/" + postId, {
    method: "DELETE",
    body: JSON.stringify(),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw json({ message: "Could not delete post." }, { status: 500 });
  }

  return redirect("/posts");
};
