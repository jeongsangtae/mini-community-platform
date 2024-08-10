import { useState, useContext } from "react";
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
  onDeleteReplyData,
  onEditReplyData,
}) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);

  const [replyEditToggle, setReplyEditToggle] = useState(false);

  // 답글을 삭제하는 함수
  const replyDeleteHandler = async () => {
    const postId = post.postId;

    // 답글 삭제 요청
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/reply",
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
      // 답글 삭제가 성공했을 때 상위 컴포넌트에 알림
      onDeleteReplyData(replyId);
    }
  };

  const replyEditToggleHandler = () => {
    setReplyEditToggle(!replyEditToggle);
  };

  return (
    <li className={classes.reply}>
      <p className={`${classes.underline} ${classes[authCtx.themeClass]}`}></p>
      <div
        className={`${classes["reply-user-edit"]} ${
          classes[authCtx.themeClass]
        }`}
      >
        <p>{name}</p>
        {email === authCtx.userInfo?.email && (
          // 사용자가 작성한 답글만 수정 및 삭제 버튼 표시
          <div>
            <button type="button" onClick={replyEditToggleHandler}>
              &#9998;
            </button>
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
  );
};

export default Reply;
