import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";
import EditComment from "./EditComment";
import Replies from "../Replies/Replies";
import AuthContext from "../../store/auth-context";

// import CommentForm from "./CommentForm";
import classes from "./Comment.module.css";

const Comment = ({
  commentId,
  name,
  email,
  content,
  date,
  onDeleteCommentData,
  onEditCommentData,
}) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);

  const [commentEditToggle, setCommentEditToggle] = useState(false);
  // const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(() => {
  //   setLoggedIn(authCtx.isLoggedIn);
  // }, [authCtx]);

  const commentDeleteHandler = async () => {
    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/comment",
      {
        method: "DELETE",
        body: JSON.stringify({ commentId }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    console.log(postId);

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.message);
      throw json({ message: "Could not delete comment." }, { status: 500 });
    } else {
      console.log(commentId);
      onDeleteCommentData(commentId);
      console.log("Delete comment");
    }
  };

  const commentEditToggleHandler = () => {
    setCommentEditToggle(!commentEditToggle);
  };

  // console.log(email);
  // console.log(authCtx.userInfo.email);

  return (
    <>
      <li className={classes.comment}>
        <div
          className={`${classes["comment-user-edit"]} ${
            classes[authCtx.themeClass]
          }`}
        >
          <p>{name}</p>
          {email === authCtx.userInfo?.email && (
            <div className={classes.actions}>
              <button type="button" onClick={commentEditToggleHandler}>
                &#9998;
              </button>
              <button type="button" onClick={commentDeleteHandler}>
                &times;
              </button>
            </div>
          )}
          {/* {loggedIn && (
            <>
              <button type="button" onClick={commentEditToggleHandler}>
                &#9998;
              </button>
              <button type="button" onClick={commentDeleteHandler}>
                &times;
              </button>
            </>
          )} */}
        </div>
        <p className={classes.content}>{content}</p>
        <p className={classes.date}>{date}</p>

        {commentEditToggle && (
          <EditComment
            method="PATCH"
            commentData={{ content, commentId }}
            onEditCommentData={onEditCommentData}
            onCommentToggle={commentEditToggleHandler}
          />
        )}
        <Replies commentId={commentId} />
      </li>
    </>
  );
};

export default Comment;
