import { useState, useContext } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./CreateComment.module.css";

const CreateComment = ({ method, onAddCommentData }) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const [comment, setComment] = useState("");

  // 댓글 입력에 대한 최대 길이 설정
  const maxLength = 300;

  // 댓글 입력 함수, 최대 길이를 초과하지 않도록 설정
  const commentInputHandler = (event) => {
    if (event.target.value.length <= maxLength) {
      setComment(event.target.value);
    }
  };

  // 입력한 댓글 제출 함수로 서버에 댓글을 전송하고 응답 처리
  const submitHandler = async (event) => {
    event.preventDefault();

    // 관리자 계정인 경우 요청을 중단하고 오류 처리
    if (authCtx.userInfo?.role === "admin") {
      authCtx.errorHelper(
        new Error("댓글 추가 실패"),
        "관리자는 댓글을 추가할 수 없습니다. 사용자 계정으로 로그인하고 다시 시도해 주세요."
      );
      return;
    }

    const postId = post.postId;

    // 서버에 보낼 요청 데이터
    let requestBody = {
      content: comment,
    };

    try {
      // 댓글 저장 요청
      const response = await fetch(`${apiURL}/posts/${postId}/comments`, {
        method: method,
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("댓글 추가 실패");
      }

      const resData = await response.json();

      onAddCommentData(resData.newComment);
      setComment("");

      return redirect("/posts/" + postId);
    } catch (error) {
      authCtx.errorHelper(
        error,
        "댓글 추가 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  };

  const commentAddButtonClass =
    authCtx.userInfo?.role === "user" ? "" : `${classes.opacity}`;

  return (
    <>
      <form
        onSubmit={submitHandler}
        className={`${classes["comment-form"]} ${classes[uiCtx.themeClass]}`}
      >
        <p>{authCtx.userName}</p>
        {authCtx.userInfo?.role === "user" ? (
          <TextareaAutosize
            required
            name="content"
            minRows={1}
            maxRows={5}
            maxLength={maxLength}
            placeholder="내용 입력"
            value={comment}
            onChange={commentInputHandler}
          />
        ) : (
          <textarea
            readOnly
            name="content"
            rows="1"
            placeholder={
              authCtx.userInfo?.role === "admin"
                ? "관리자는 댓글을 추가할 수 없습니다."
                : "로그인이 필요합니다."
            }
            value={comment}
            onChange={commentInputHandler}
          />
        )}
        <button className={commentAddButtonClass}>등록</button>
      </form>
    </>
  );
};

export default CreateComment;
