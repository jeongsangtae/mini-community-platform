import { redirect } from "react-router-dom";

import PostForm from "../components/Posts/PostForm";

const CreatePostPage = () => {
  return (
    <>
      <PostForm method="post" />
    </>
  );
};

export default CreatePostPage;

export const action = async ({ request }) => {
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);
  await fetch("http://localhost:3000/posts", {
    method: "POST",
    body: JSON.stringify(postData),
    headers: { "Content-Type": "application/json" },
  });

  return redirect("/posts");
};
