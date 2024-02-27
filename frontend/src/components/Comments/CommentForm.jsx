import { useState } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";

const CommentForm = ({
  method,
  commentData,
  onAddCommentData,
  onPatchCommentData,
}) => {
  const [comment, setComment] = useState("");
  const post = useRouteLoaderData("post-detail");

  const commentInputHandler = (event) => {
    const commentContent = event.target.value;
    setComment(commentContent);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    console.log(comment);

    const postId = post.postId;

    let requestBody = {
      content: comment,
    };

    // if (method === 'PATCH') {
    //   requestBody = {
    //     content: comment,
    //     commentId: commentData.commentId;
    // }

    if (method === "PATCH") {
      requestBody.commentId = commentData.commentId;
    }

    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/comments",
      {
        method: method,
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(method);

    // if (response.ok && method === "POST") {
    //   const resData = await response.json();
    //   onAddCommentData(resData.newComment);
    //   console.log(resData);
    //   console.log(resData.newComment);
    // } else if (!response.ok) {
    //   throw json({ message: "Could not save comment." }, { status: 500 });
    // }

    if (!response.ok) {
      throw json({ message: "Could not save comment." }, { status: 500 });
    } else if (response.ok && method === "POST") {
      const resData = await response.json();
      onAddCommentData(resData.newComment);
      console.log(resData);
      console.log(resData.newComment);
    } else if (response.ok && method === "PATCH") {
      // 수정과 관련된 내용
      const resData = await response.json();
      onPatchCommentData(resData.updateComment);
      console.log(resData);
      console.log(resData.updateComment);
    }

    console.log(method);

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
          defaultValue={commentData ? commentData.content : ""}
          onChange={commentInputHandler}
        />
        <button>등록</button>
      </form>
    </>
  );
};

export default CommentForm;
