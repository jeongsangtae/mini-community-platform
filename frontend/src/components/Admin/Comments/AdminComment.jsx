import { useState, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import AuthContext from "../../../store/auth-context";
import AdminReplies from "../Replies/AdminReplies";
import classes from "./AdminComment.module.css";

const AdminComment = ({
  commentId,
  name,
  content,
  date,
  onDeleteCommentData,
  onRepliesValue,
}) => {
  const post = useRouteLoaderData("admin-post-detail");
  const authCtx = useContext(AuthContext);

  const [replyToggle, setReplyToggle] = useState(false);

  // 댓글을 삭제하는 함수
  const commentDeleteHandler = async () => {
    const postId = post.postId;

    try {
      // 댓글 삭제 요청
      const response = await fetch(
        "http://localhost:3000/admin/posts/" + postId + "/comment",
        {
          method: "DELETE",
          body: JSON.stringify({ commentId }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("댓글 삭제 실패");
      }

      onDeleteCommentData(commentId);
    } catch (error) {
      authCtx.errorHelper(
        error,
        "댓글 삭제 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  };

  const replyToggleHandler = () => {
    setReplyToggle(!replyToggle);
  };

  // 답글 수를 상위 컴포넌트에 전달하는 함수
  const repliesLengthHandler = (length) => {
    onRepliesValue(length);
  };

  return (
    <li className={classes.comment}>
      <div
        className={`${classes["comment-user-edit"]} ${
          classes[authCtx.themeClass]
        }`}
      >
        <p>{name}</p>

        <div>
          <button type="button" onClick={commentDeleteHandler}>
            &times;
          </button>
        </div>
      </div>
      <p className={classes.content}>{content}</p>
      <p className={classes.date}>{date}</p>

      <AdminReplies
        commentId={commentId}
        replyToggle={replyToggle}
        onReplyToggle={replyToggleHandler}
        repliesLength={repliesLengthHandler}
      />

      <p className={`${classes.underline} ${classes[authCtx.themeClass]}`}></p>
    </li>
  );
};

export default AdminComment;
