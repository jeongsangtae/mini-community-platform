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

  // 답글 입력 함수, 최대 길이를 초과하지 않도록 설정
  const replyinputHandler = (event) => {
    if (event.target.value.length <= maxLength) {
      setReply(event.target.value);
    }
  };

  // 폼 제출 시 호줄되는 함수 (새 답글 등록 또는 기존 답글 수정)
  const submitHandler = async (event) => {
    event.preventDefault();

    // 입력된 답글이 없을 경우 기존 데이터를 사용
    let contentTrimConfrim = reply.trim() !== "" ? reply : replyData.content;

    const postId = post.postId;

    // 요청 본문에 담을 데이터 생성
    let requestBody = {
      content: contentTrimConfrim,
    };

    // POST 요청 시 댓글 ID를 추가
    if (method === "POST") {
      requestBody.commentId = commentId;
    }

    // PATCH 요청 시 답글 ID를 추가
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
      onAddReplyData(resData.newReply); // 새 답글을 부모 컴포넌트로 전달
    } else if (response.ok && method === "PATCH") {
      const resData = await response.json();
      onEditReplyData(resData.editReply); // 수정된 답글을 부모 컴포넌트로 전달
    }

    // 제출된 후에 답글 폼을 닫음
    onReplyToggle();
  };

  // 로그인 상태가 아닌 경우 답글 폼을 닫음
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
        {/* 로그인 상태에 따라 답글 입력 필드 렌더링 */}
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
