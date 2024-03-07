import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import Replies from "../Replies/Replies";

// import CommentForm from "./CommentForm";
import classes from "./Comment.module.css";
import EditComment from "./EditComment";

const Comment = ({
  commentId,
  content,
  date,
  onDeleteCommentData,
  onEditCommentData,
}) => {
  const post = useRouteLoaderData("post-detail");
  const [commentEditToggle, setCommentEditToggle] = useState(false);

  const commentDeleteHandler = async () => {
    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/comment",
      {
        method: "DELETE",
        body: JSON.stringify({ commentId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(postId);

    if (!response.ok) {
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

  return (
    <>
      <li className={classes.comment}>
        <div className={classes["comment-user-edit"]}>
          <p>GUEST</p>
          <button type="button" onClick={commentEditToggleHandler}>
            &#9998;
          </button>
          <button type="button" onClick={commentDeleteHandler}>
            &times;
          </button>
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
