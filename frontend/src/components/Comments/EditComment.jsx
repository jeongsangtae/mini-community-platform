import { useState, useEffect, useContext } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import AuthContext from "../../store/auth-context";
import classes from "./EditComment.module.css";

const EditComment = ({
  method,
  commentData,
  onEditCommentData,
  onCommentToggle,
}) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);

  const [comment, setComment] = useState("");
  const maxLength = 300;

  const commentInputHandler = (event) => {
    if (event.target.value.length <= maxLength) {
      setComment(event.target.value);
    }
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
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.message);
      throw json({ message: "Could not save comment." }, { status: 500 });
    } else {
      const resData = await response.json();
      onEditCommentData(resData.editComment);
      onCommentToggle();
    }

    return redirect("/posts/" + postId);
  };

  useEffect(() => {
    if (authCtx.isLoggedIn === false) {
      onCommentToggle();
    }
  }, [authCtx]);

  const commentEditButtonClass = authCtx.isLoggedIn
    ? `${classes["edit-button"]} ${classes[authCtx.themeClass]}`
    : `${classes["edit-button"]} ${classes[authCtx.themeClass]} ${
        classes.opacity
      }`;
  const commentCancelButtonClass = authCtx.isLoggedIn
    ? `${classes["cancel-button"]} ${classes[authCtx.themeClass]}`
    : `${classes["cancel-button"]} ${classes[authCtx.themeClass]} ${
        classes.opacity
      }`;

  return (
    <>
      <form
        onSubmit={submitHandler}
        className={`${classes["comment-form"]} ${classes[authCtx.themeClass]}`}
      >
        <p>{authCtx.userName}</p>
        {authCtx.isLoggedIn ? (
          <TextareaAutosize
            required
            name="content"
            minRows={1}
            maxRows={5}
            maxLength={maxLength}
            placeholder="내용 입력"
            defaultValue={commentData.content}
            onChange={commentInputHandler}
          />
        ) : (
          <textarea
            className={classes.textarea}
            readOnly
            name="content"
            rows="1"
            placeholder="로그인이 필요합니다."
            // defaultValue={commentData.content}
            onChange={commentInputHandler}
          />
        )}
        <div className={classes["comment-button"]}>
          <button className={commentEditButtonClass}>수정</button>
          {onCommentToggle && (
            <button
              onClick={onCommentToggle}
              className={commentCancelButtonClass}
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
