import { useState, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import ReplyForm from "./ReplyForm";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
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
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const [replyEditToggle, setReplyEditToggle] = useState(false);

  // 답글을 삭제하는 함수
  const replyDeleteHandler = async () => {
    const postId = post.postId;

    try {
      // 답글 삭제 요청
      const response = await fetch(`${apiURL}/posts/${postId}/replies`, {
        method: "DELETE",
        body: JSON.stringify({ replyId }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("답글 삭제 실패");
      }

      // 답글 삭제가 성공했을 때 상위 컴포넌트에 알림
      onDeleteReplyData(replyId);
    } catch (error) {
      authCtx.errorHelper(
        error,
        "답글 삭제 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  };

  const replyEditToggleHandler = () => {
    setReplyEditToggle(!replyEditToggle);
  };

  return (
    <li className={classes.reply}>
      <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>
      <div
        className={`${classes["reply-user-edit"]} ${classes[uiCtx.themeClass]}`}
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
