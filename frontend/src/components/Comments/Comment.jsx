import { useState, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";
import EditComment from "./EditComment";
import Replies from "../Replies/Replies";
import AuthContext from "../../store/auth-context";

import classes from "./Comment.module.css";

const Comment = ({
  commentId,
  name,
  email,
  content,
  date,
  onDeleteCommentData,
  onEditCommentData,
  onRepliesValue,
}) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);

  const [commentEditToggle, setCommentEditToggle] = useState(false);
  const [replyToggle, setReplyToggle] = useState(false);

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

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.message);
      throw json({ message: "Could not delete comment." }, { status: 500 });
    } else {
      onDeleteCommentData(commentId);
    }
  };

  const commentEditToggleHandler = () => {
    setCommentEditToggle(!commentEditToggle);
  };

  const replyToggleHandler = () => {
    setReplyToggle(!replyToggle);
  };

  const repliesLengthHandler = (length) => {
    onRepliesValue(length);
  };

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
            <div>
              <button type="button" onClick={commentEditToggleHandler}>
                &#9998;
              </button>
              <button type="button" onClick={commentDeleteHandler}>
                &times;
              </button>
            </div>
          )}
        </div>

        <p className={classes.content}>{content}</p>
        <p className={classes.date}>{date}</p>

        {authCtx.isLoggedIn && (
          <button
            type="button"
            onClick={replyToggleHandler}
            className={`${classes["reply-button"]} ${
              classes[authCtx.themeClass]
            }`}
          >
            답글쓰기
          </button>
        )}

        {commentEditToggle && (
          <EditComment
            method="PATCH"
            commentData={{ content, commentId }}
            onEditCommentData={onEditCommentData}
            onCommentToggle={commentEditToggleHandler}
          />
        )}

        <Replies
          commentId={commentId}
          replyToggle={replyToggle}
          onReplyToggle={replyToggleHandler}
          repliesLength={repliesLengthHandler}
        />

        <p
          className={`${classes.underline} ${classes[authCtx.themeClass]}`}
        ></p>
      </li>
    </>
  );
};

export default Comment;
