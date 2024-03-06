import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

import classes from "./Reply.module.css";
import ReplyForm from "./ReplyForm";

const Reply = ({
  replyId,
  content,
  date,
  commentId,
  onDeleteReplyData,
  onEditReplyData,
}) => {
  const post = useRouteLoaderData("post-detail");
  const [replyEditToggle, setReplyEditToggle] = useState(false);

  const replyDeleteHandler = async () => {
    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/replies",
      {
        method: "DELETE",
        body: JSON.stringify({ replyId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw json({ message: "Could not delete reply." }, { status: 500 });
    } else {
      console.log(replyId);
      onDeleteReplyData(replyId);
      console.log("Delete reply");
    }
  };

  const replyEditToggleHandler = () => {
    setReplyEditToggle(!replyEditToggle);
  };

  return (
    <>
      <li>
        <p className={classes.content}>{content}</p>
        <p>{date}</p>
        <button onClick={replyEditToggleHandler}>수정</button>
        <button type="button" onClick={replyDeleteHandler}>
          삭제
        </button>
        {replyEditToggle && (
          <ReplyForm
            method="PATCH"
            replyData={{ content, replyId }}
            onEditReplyData={onEditReplyData}
            onReplyToggle={replyEditToggleHandler}
          />
        )}
      </li>
    </>
  );
};

export default Reply;
