import { useContext } from "react";
import { useNavigate, Form, redirect, json } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./PostForm.module.css";

const PostForm = ({ method, userData, postData, postPageName }) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate(-1);
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
            {/* <label htmlFor="title">제목</label> */}
            <input
              required
              type="text"
              id="title"
              name="title"
              placeholder="제목을 입력해 주세요"
              defaultValue={postData ? postData.title : ""}
            />
          </div>
          <div>
            {/* <label htmlFor="name">작성자</label> */}
            {postData ? <p>{postData.name}</p> : <p>{userData?.name}</p>}
          </div>
          <div>
            <textarea
              required
              name="content"
              placeholder="내용 입력"
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

export const action = async ({ request, params }) => {
  const method = await request.method;
  console.log(method);
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);

  // const postData = {
  //   title: formData.get("title"),
  //   name: formData.get("name"),
  //   content: formData.get("content"),
  // };

  const postId = params.postId;

  let url = "http://localhost:3000/posts";

  if (method === "PATCH") {
    url = "http://localhost:3000/posts/" + postId + "/edit";
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
    credentials: "include",
  });

  if (response.status === 422) {
    return response;
  }

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData.message);
    throw json({ message: "Could not save post." }, { status: 500 });
  }

  if (method === "POST") {
    return redirect("/posts");
  } else {
    return redirect("/posts/" + postId);
  }
};
