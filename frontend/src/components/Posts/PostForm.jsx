import { useContext } from "react";
import { useNavigate, Form, redirect, json } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./PostForm.module.css";

const PostForm = ({ method, userData, postData, postPageName }) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate(-1); // 현재 페이지에서 이전 페이지로 이동
  };

  return (
    <div className={`${classes.background} ${classes[authCtx.themeClass]}`}>
      <div
        className={`${classes["post-form-container"]} ${
          classes[authCtx.themeClass]
        }`}
      >
        <h1 className={`${classes.heading} ${classes[authCtx.themeClass]}`}>
          {postPageName}
        </h1>
        <Form
          method={method}
          className={`${classes.form} ${classes[authCtx.themeClass]}`}
        >
          <div>
            <input
              required
              type="text"
              id="title"
              name="title"
              placeholder="제목을 입력해 주세요"
              // 편집 시 기존 제목 표시, 새 게시글 작성 시 빈 입력란
              defaultValue={postData ? postData.title : ""}
            />
          </div>
          <div>
            {/* 게시글 작성자 이름 표시 (편집 시 기존 작성자, 새로운 작성 시 현재 사용자) */}
            {postData ? <p>{postData.name}</p> : <p>{userData?.name}</p>}
          </div>
          <div>
            <textarea
              required
              name="content"
              placeholder="내용 입력"
              // 편집 시 기존 내용 표시, 새 게시글 작성 시 빈 텍스트
              defaultValue={postData ? postData.content : ""}
            />
          </div>
          <div className={`${classes.actions} ${classes[authCtx.themeClass]}`}>
            <button>등록</button>
            <button type="button" onClick={closeHandler}>
              취소
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PostForm;

// 게시글 Form action 함수 내용
export const action = async ({ request, params }) => {
  const method = await request.method; // HTTP 메서드 (POST 또는 PATCH) 가져오기
  const formData = await request.formData(); // form 데이터 가져오기
  const postData = Object.fromEntries(formData); // form 데이터를 객체로 변환

  // URL 매개변수에서 게시글 ID 가져옴 (편집 시에만 사용)
  const postId = params.postId;

  const url =
    method === "POST"
      ? "http://localhost:3000/posts" // 게시글 추가 시 사용되는 URL
      : `http://localhost:3000/posts/${postId}/edit`; // 게시글 수정 시 사용되는 URL

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`게시글 ${method === "POST" ? "추가" : "수정"} 실패`);
    }

    return redirect(method === "POST" ? "/posts" : `/posts/${postId}`);
  } catch (error) {
    console.error("에러 내용:", error.message);
    alert(
      `게시글 ${
        method === "POST" ? "추가" : "수정"
      } 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요.`
    );

    return null;
  }
};
