import { useState, useEffect, useContext } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./CreateComment.module.css";

const CreateComment = ({ method, onAddCommentData }) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);

  const [comment, setComment] = useState("");
  const [textareaHeight, setTextareaHeight] = useState("auth");
  // const [prevTextLength, setPrevTextLength] = useState(0);

  const commentInputHandler = (event) => {
    setComment(event.target.value);
    setTextareaHeight(`${event.target.scrollHeight}px`);
  };

  // const textareaRestoreHandler = (event) => {
  //   console.log(event.target.value.length + " 입력한 텍스트 길이");
  //   console.log(prevTextLength + " 이전 텍스트 길이");
  //   if (event.target.value.length < prevTextLength) {
  //     setTextareaHeight(`${event.target.scrollHeight}px`);
  //   }
  //   setPrevTextLength(event.target.value.length);
  // };

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
        credentials: "include",
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

  const commentAddButtonClass = authCtx.isLoggedIn ? "" : `${classes.opacity}`;

  return (
    <>
      <form onSubmit={submitHandler} className={classes["comment-form"]}>
        <p>{authCtx.userName}</p>
        {authCtx.isLoggedIn ? (
          <textarea
            required
            name="content"
            rows="1"
            style={{ height: textareaHeight }}
            placeholder="내용 입력"
            value={comment}
            onChange={commentInputHandler}
          />
        ) : (
          <textarea
            readOnly
            name="content"
            rows="1"
            placeholder="로그인이 필요합니다."
            value={comment}
            onChange={commentInputHandler}
          />
        )}
        <button className={commentAddButtonClass}>등록</button>
      </form>
    </>
  );
};

export default CreateComment;
