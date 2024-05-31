import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminReply.module.css";

const AdminReply = ({
  replyId,
  name,
  email,
  content,
  date,
  commentId,
  onDeleteReplyData,
  onEditReplyData,
}) => {
  const post = useRouteLoaderData("admin-post-detail");
  const authCtx = useContext(AuthContext);

  const replyDeleteHandler = async () => {
    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/admin/posts/" + postId + "/reply",
      {
        method: "DELETE",
        body: JSON.stringify({ replyId }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.message);
      throw json({ message: "Could not delete reply." }, { status: 500 });
    } else {
      console.log(replyId);
      onDeleteReplyData(replyId);
      console.log("Delete reply");
    }
  };

  return (
    <>
      <li className={classes.reply}>
        <p
          className={`${classes.underline} ${classes[authCtx.themeClass]}`}
        ></p>
        <div
          className={`${classes["reply-user-edit"]} ${
            classes[authCtx.themeClass]
          }`}
        >
          <p>{name}</p>

          <div>
            <button type="button" onClick={replyDeleteHandler}>
              &times;
            </button>
          </div>
        </div>
        <p className={classes.content}>{content}</p>
        <p className={classes.date}>{date}</p>
      </li>
    </>
  );
};

export default AdminReply;
