import { useState, useEffect, useContext } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./CreateComment.module.css";

const CreateComment = ({ method, onAddCommentData, userData }) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);

  const [comment, setComment] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

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

  useEffect(() => {
    console.log(authCtx.isLoggedIn);
    setLoggedIn(authCtx.isLoggedIn);
  }, [authCtx]);

  const commentAddButtonClass = loggedIn ? "" : `${classes.opacity}`;

  return (
    <>
      <form onSubmit={submitHandler} className={classes["comment-form"]}>
        <p>{userData ? userData.name : "GUEST"}</p>
        {loggedIn ? (
          <textarea
            required
            name="content"
            rows="1"
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
