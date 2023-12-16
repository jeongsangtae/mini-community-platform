import { redirect } from "react-router-dom";

import CreatePost from "../components/Posts/CreatePost";

const CreatePostPage = () => {
  return (
    <>
      <CreatePost />
    </>
  );
};

export default CreatePostPage;

export const action = async ({ request }) => {
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);
  // formData.get("body");
  await fetch("http://localhost:3000/posts", {
    method: "POST",
    body: JSON.stringify(postData),
    headers: { "Content-Type": "application/json" },
  });

  return redirect("/posts");
};
