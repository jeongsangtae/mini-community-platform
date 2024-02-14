import { useNavigate, Form, redirect } from "react-router-dom";

import classes from "./PostForm.module.css";

const PostForm = ({ method, postData }) => {
  console.log(postData);
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <h1 className={classes.heading}>게시글 추가 페이지</h1>
      <Form method={method} className={classes.form}>
        <div>
          <label htmlFor="title">제목</label>
          <input
            required
            type="text"
            id="title"
            name="title"
            defaultValue={postData ? postData.title : ""}
          />
        </div>
        <div>
          <label htmlFor="name">작성자</label>
          <input required type="text" id="name" name="name" />
        </div>
        <div>
          <textarea
            required
            name="content"
            placeholder="내용 입력"
            defaultValue={postData ? postData.content : ""}
          />
        </div>
        <div className={classes.actions}>
          <button type="button" onClick={closeHandler}>
            취소
          </button>
          <button>등록</button>
        </div>
      </Form>
    </>
  );
};

export default PostForm;

export const action = async ({ request }) => {
  const method = await request.method;
  console.log(method);
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);

  // const postData = {
  //   title: formData.get("title"),
  //   name: formData.get("name"),
  //   content: formData.get("content"),
  // };

  let url = "http://localhost:3000/posts";

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (response.status === 422) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not save event." }, { status: 500 });
  }

  return redirect("/posts");
};
