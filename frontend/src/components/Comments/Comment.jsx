import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import Replies from "../Replies/Replies";

import CommentForm from "./CommentForm";

const Comment = ({
  commentId,
  content,
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
      <li>
        <p>{content}</p>
        <button type="button" onClick={commentEditToggleHandler}>
          수정
        </button>
        <button type="button" onClick={commentDeleteHandler}>
          삭제
        </button>

        {commentEditToggle && (
          <CommentForm
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
