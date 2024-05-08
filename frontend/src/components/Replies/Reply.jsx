import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import ReplyForm from "./ReplyForm";
import AuthContext from "../../store/auth-context";
import classes from "./Reply.module.css";

const Reply = ({
  replyId,
  name,
  email,
  content,
  date,
  commentId,
  onDeleteReplyData,
  onEditReplyData,
}) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);

  const [replyEditToggle, setReplyEditToggle] = useState(false);
  // const [loggedIn, setLoggedIn] = useState(false);

  const replyDeleteHandler = async () => {
    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/replies",
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

  const replyEditToggleHandler = () => {
    setReplyEditToggle(!replyEditToggle);
  };

  // useEffect(() => {
  //   setLoggedIn(authCtx.isLoggedIn);
  // }, [authCtx]);

  return (
    <>
      <li className={classes.reply}>
        <p
          className={`${classes.underline} ${classes[authCtx.themeClass]}`}
        ></p>
        <div className={classes["reply-user-edit"]}>
          <p>{name}</p>
          {email === authCtx.userInfo?.email && (
            <div>
              <button onClick={replyEditToggleHandler}>&#9998;</button>
              <button type="button" onClick={replyDeleteHandler}>
                &times;
              </button>
            </div>
          )}
        </div>
        <p className={classes.content}>{content}</p>
        <p className={classes.date}>{date}</p>
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
