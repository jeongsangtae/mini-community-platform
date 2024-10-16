import { useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import AuthContext from "../../../store/auth-context";
import UIContext from "../../../store/ui-context";
import classes from "./AdminReply.module.css";

const AdminReply = ({ replyId, name, content, date, onDeleteReplyData }) => {
  const post = useRouteLoaderData("admin-post-detail");
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  // 답글을 삭제하는 함수
  const replyDeleteHandler = async () => {
    const postId = post.postId;

    try {
      // 답글 삭제 요청
      const response = await fetch(`${apiURL}/admin/posts/${postId}/replies`, {
        method: "DELETE",
        body: JSON.stringify({ replyId }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("답글 삭제 실패");
      }

      onDeleteReplyData(replyId);
    } catch (error) {
      authCtx.errorHelper(
        error,
        "답글 삭제 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <li className={classes.reply}>
      <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>
      <div
        className={`${classes["reply-user-edit"]} ${classes[uiCtx.themeClass]}`}
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
  );
};

export default AdminReply;
