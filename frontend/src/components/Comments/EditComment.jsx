import { useState } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";

import classes from "./EditComment.module.css";

const EditComment = ({
  method,
  commentData,
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
      commentId: commentData.commentId,
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
      onEditCommentData(resData.editComment);
      onCommentToggle();
    }

    console.log(comment);

    return redirect("/posts/" + postId);
  };

  return (
    <>
      <form onSubmit={submitHandler} className={classes["comment-form"]}>
        <p>GUEST</p>
        <textarea
          className={classes.textarea}
          required
          name="content"
          rows="1"
          placeholder="내용 입력"
          defaultValue={commentData.content}
          onChange={commentInputHandler}
        />
        <div className={classes["comment-button"]}>
          <button className={classes["edit-button"]}>수정</button>
          {onCommentToggle && (
            <button
              onClick={onCommentToggle}
              className={classes["cancel-button"]}
            >
              취소
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default EditComment;
