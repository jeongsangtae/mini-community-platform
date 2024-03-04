import { useState } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";

const CreateComment = ({ method, onAddCommentData }) => {
  const [comment, setComment] = useState("");
  const post = useRouteLoaderData("post-detail");

  const commentInputHandler = (event) => {
    setComment(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const postId = post.postId;

    let requestBody = {
      content: comment,
    };

    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/comments",
      {
        method: method,
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(method);

    if (!response.ok) {
      throw json({ message: "Could not save comment." }, { status: 500 });
    } else {
      const resData = await response.json();
      onAddCommentData(resData.newComment);
      setComment("");
    }

    console.log(comment);

    return redirect("/posts/" + postId);
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <textarea
          required
          name="content"
          rows="5"
          placeholder="내용 입력"
          value={comment}
          onChange={commentInputHandler}
        />
        <button>등록</button>
      </form>
    </>
  );
};

export default CreateComment;
