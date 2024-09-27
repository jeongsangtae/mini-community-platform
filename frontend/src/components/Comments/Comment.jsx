import { useState, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import EditComment from "./EditComment";
import Replies from "../Replies/Replies";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./Comment.module.css";

const Comment = ({
  commentId,
  name,
  email,
  content,
  date,
  onDeleteCommentData,
  onEditCommentData,
  onRepliesValue,
}) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const [commentEditToggle, setCommentEditToggle] = useState(false);
  const [replyToggle, setReplyToggle] = useState(false);

  // 댓글을 삭제하는 함수
  const commentDeleteHandler = async () => {
    const postId = post.postId;

    try {
      // 댓글 삭제 요청
      const response = await fetch(`${apiURL}/posts/${postId}/comment`, {
        method: "DELETE",
        body: JSON.stringify({ commentId }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("댓글 삭제 실패");
      }

      // 댓글 삭제가 성공했을 때 상위 컴포넌트에 알림 (상태 끌어올리기)
      onDeleteCommentData(commentId);
    } catch (error) {
      authCtx.errorHelper(
        error,
        "댓글 삭제 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  };

  const commentEditToggleHandler = () => {
    setCommentEditToggle(!commentEditToggle);
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
          classes[uiCtx.themeClass]
        }`}
      >
        <p>{name}</p>

        {email === authCtx.userInfo?.email && (
          // 사용자가 작성한 댓글만 수정 및 삭제 버튼 표시
          <div>
            <button type="button" onClick={commentEditToggleHandler}>
              &#9998;
            </button>
            <button type="button" onClick={commentDeleteHandler}>
              &times;
            </button>
          </div>
        )}
      </div>

      <p className={classes.content}>{content}</p>
      <p className={classes.date}>{date}</p>

      {authCtx.isLoggedIn && (
        // 로그인한 사용자만 답글 버튼 표시
        <button
          type="button"
          onClick={replyToggleHandler}
          className={`${classes["reply-button"]} ${classes[uiCtx.themeClass]}`}
        >
          답글쓰기
        </button>
      )}

      {commentEditToggle && (
        <EditComment
          method="PATCH"
          commentData={{ content, commentId }}
          onEditCommentData={onEditCommentData}
          onCommentToggle={commentEditToggleHandler}
        />
      )}

      <Replies
        commentId={commentId}
        replyToggle={replyToggle}
        onReplyToggle={replyToggleHandler}
        repliesLength={repliesLengthHandler}
      />

      <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>
    </li>
  );
};

export default Comment;
