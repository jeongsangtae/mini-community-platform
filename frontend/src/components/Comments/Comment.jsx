import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import Replies from "../Replies/Replies";
import ReplyForm from "../Replies/ReplyForm";

import CommentForm from "./CommentForm";

const Comment = ({
  commentId,
  content,
  onDeleteCommentData,
  onPatchCommentData,
}) => {
  const post = useRouteLoaderData("post-detail");
  const [commentEditToggle, setCommentEditToggle] = useState(false);
  const [replyToggle, setReplyToggle] = useState(false);

  const commentDeleteHandler = async () => {
    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/comment",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: commentId }),
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

  const replyToggleHandler = () => {
    setReplyToggle(!replyToggle);
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
        <button type="button" onClick={replyToggleHandler}>
          답글쓰기
        </button>

        {commentEditToggle && (
          <CommentForm
            method="PATCH"
            commentData={{ content, commentId }}
            onPatchCommentData={onPatchCommentData}
            onCommentToggle={commentEditToggleHandler}
          />
        )}

        <Replies />

        {replyToggle && <ReplyForm />}
      </li>
    </>
  );
};

export default Comment;
