import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
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
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const [reply, setReply] = useState("");
  const maxLength = 300;

  // 답글 입력 함수, 최대 길이를 초과하지 않도록 설정
  const replyInputHandler = (event) => {
    if (event.target.value.length <= maxLength) {
      setReply(event.target.value);
    }
  };

  // 폼 제출 시 호출되는 함수 (새 답글 등록 또는 기존 답글 수정)
  const submitHandler = async (event) => {
    event.preventDefault();

    // 입력된 답글이 없을 경우 기존 데이터를 사용
    let contentTrimConfrim = reply.trim() !== "" ? reply : replyData.content;

    const postId = post.postId;

    // 요청 본문에 담을 데이터 생성
    let requestBody = {
      content: contentTrimConfrim,
    };

    // POST 요청 시 답글 ID를 추가
    if (method === "POST") {
      requestBody.commentId = commentId;
      // PATCH 요청 시 답글 ID를 추가
    } else if (method === "PATCH") {
      requestBody.replyId = replyData.replyId;
    }

    try {
      const response = await fetch(`${apiURL}/posts/${postId}/replies`, {
        method: method,
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`답글 ${method === "POST" ? "추가" : "수정"} 실패`);
      }

      const resData = await response.json();

      method === "POST"
        ? onAddReplyData(resData.newReply) // 새 답글을 부모 컴포넌트로 전달
        : onEditReplyData(resData.editReply); // 수정된 답글을 부모 컴포넌트로 전달

      // 제출된 후에 답글 폼을 닫음
      onReplyToggle();
    } catch (error) {
      authCtx.errorHelper(
        error,
        `답글 ${
          method === "POST" ? "추가" : "수정"
        } 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요.`
      );
    }
  };

  // 로그인 상태가 아닌 경우 답글 폼을 닫음
  useEffect(() => {
    if (authCtx.isLoggedIn === false) {
      onReplyToggle();
    }
  }, [authCtx]);

  const replyEditButtonClass = authCtx.isLoggedIn
    ? `${classes["edit-button"]} ${classes[uiCtx.themeClass]}`
    : `${classes["edit-button"]} ${classes[uiCtx.themeClass]} ${
        classes.opacity
      }`;
  const replyCancelButtonClass = authCtx.isLoggedIn
    ? `${classes["cancel-button"]} ${classes[uiCtx.themeClass]}`
    : `${classes["cancel-button"]} ${classes[uiCtx.themeClass]} ${
        classes.opacity
      }`;

  return (
    <>
      <form
        onSubmit={submitHandler}
        className={`${classes["reply-form"]} ${classes[uiCtx.themeClass]}`}
      >
        <p>{authCtx.userName}</p>
        <TextareaAutosize
          className={classes.textarea}
          required
          name="content"
          minRows={1}
          maxRows={5}
          maxLength={maxLength}
          placeholder="내용 입력"
          defaultValue={replyData ? replyData.content : ""}
          onChange={replyInputHandler}
        />

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
