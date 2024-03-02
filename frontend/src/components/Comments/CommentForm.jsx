import { useState } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";

const CommentForm = ({
  method,
  commentData,
  onAddCommentData,
  onEditCommentData,
  onCommentToggle,
}) => {
  const [comment, setComment] = useState("");
  const post = useRouteLoaderData("post-detail");

  const commentInputHandler = (event) => {
    setComment(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    let contentTrimConfrim =
      comment.trim() !== "" ? comment : commentData.content;

    const postId = post.postId;

    let requestBody = {
      content: contentTrimConfrim,
    };

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

    if (!response.ok) {
      throw json({ message: "Could not save comment." }, { status: 500 });
    } else if (response.ok && method === "POST") {
      const resData = await response.json();
      onAddCommentData(resData.newComment);
      console.log(resData);
      console.log(resData.newComment);
    } else if (response.ok && method === "PATCH") {
      const resData = await response.json();
      onEditCommentData(resData.editComment);
      onCommentToggle();
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
        <button>{method === "POST" ? "등록" : "수정"}</button>
        {onCommentToggle && <button onClick={onCommentToggle}>취소</button>}
      </form>
    </>
  );
};

export default CommentForm;
