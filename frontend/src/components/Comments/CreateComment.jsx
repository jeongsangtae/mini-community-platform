import { useState } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";

const CreateComment = ({ onCommentData }) => {
  const [comment, setComment] = useState("");
  const post = useRouteLoaderData("post-detail");

  const commentChangeHandler = (event) => {
    const commentContent = event.target.value;
    setComment(commentContent);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    console.log(comment);

    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/comments",
      {
        method: "POST",
        body: JSON.stringify({ content: comment }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw json({ message: "댓글 추가 실패" }, { status: 500 });
    } else {
      console.log("add comments");
      const resData = await response.json();
      // onCommentData(comment);
      onCommentData(resData.newComment);
    }

    return redirect("/posts/" + postId);
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <textarea
          placeholder="내용 입력"
          rows="5"
          name="content"
          onChange={commentChangeHandler}
        />
        <button>등록</button>
      </form>
    </>
  );
};

export default CreateComment;
