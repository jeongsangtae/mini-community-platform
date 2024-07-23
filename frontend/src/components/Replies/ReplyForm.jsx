import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import AuthContext from "../../store/auth-context";
import classes from "./ReplyForm.module.css";

const ReplyForm = ({
  method,
  replyData,
  commentId,
  onAddReplyData,
  onEditReplyData,
  onReplyToggle,
}) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);

  const [reply, setReply] = useState("");
  const maxLength = 300;

  const replyinputHandler = (event) => {
    if (event.target.value.length <= maxLength) {
      setReply(event.target.value);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    let contentTrimConfrim = reply.trim() !== "" ? reply : replyData.content;

    const postId = post.postId;

    let requestBody = {
      content: contentTrimConfrim,
    };

    if (method === "POST") {
      requestBody.commentId = commentId;
    }

    if (method === "PATCH") {
      requestBody.replyId = replyData.replyId;
    }

    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/replies",
      {
        method: method,
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.message);
      throw json({ message: "Could not save reply." }, { status: 500 });
    } else if (response.ok && method === "POST") {
      const resData = await response.json();
      onAddReplyData(resData.newReply);
    } else if (response.ok && method === "PATCH") {
      const resData = await response.json();
      onEditReplyData(resData.editReply);
    }

    onReplyToggle();
  };

  useEffect(() => {
    if (authCtx.isLoggedIn === false) {
      onReplyToggle();
    }
  }, [authCtx]);

  const replyEditButtonClass = authCtx.isLoggedIn
    ? `${classes["edit-button"]} ${classes[authCtx.themeClass]}`
    : `${classes["edit-button"]} ${classes[authCtx.themeClass]} ${
        classes.opacity
      }`;
  const replyCancelButtonClass = authCtx.isLoggedIn
    ? `${classes["cancel-button"]} ${classes[authCtx.themeClass]}`
    : `${classes["cancel-button"]} ${classes[authCtx.themeClass]} ${
        classes.opacity
      }`;

  return (
    <>
      <form
        onSubmit={submitHandler}
        className={`${classes["reply-form"]} ${classes[authCtx.themeClass]}`}
      >
        <p>{authCtx.userName}</p>
        {authCtx.isLoggedIn ? (
          <TextareaAutosize
            className={classes.textarea}
            required
            name="content"
            minRows={1}
            maxRows={5}
            maxLength={maxLength}
            placeholder="내용 입력"
            defaultValue={replyData ? replyData.content : ""}
            onChange={replyinputHandler}
          />
        ) : (
          <textarea
            className={classes.textarea}
            readOnly
            name="content"
            rows="1"
            placeholder="로그인이 필요합니다."
            // defaultValue={replyData ? replyData.content : ""}
            onChange={replyinputHandler}
          />
        )}

        <div className={classes["reply-button"]}>
          <button className={replyEditButtonClass}>
            {method === "POST" ? "등록" : "수정"}
          </button>
          {onReplyToggle && (
            <button onClick={onReplyToggle} className={replyCancelButtonClass}>
              취소
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default ReplyForm;
