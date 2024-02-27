import { useNavigate, Form } from "react-router-dom";

import classes from "./CreatePost.module.css";

const CreatePost = () => {
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <h1 className={classes.heading}>게시글 추가 페이지</h1>
      <Form method="post" className={classes.form}>
        <div>
          <label htmlFor="title">제목</label>
          <input required type="text" id="title" name="title" />
        </div>
        <div>
          <label htmlFor="name">작성자</label>
          <input required type="text" id="name" name="name" />
        </div>
        <div>
          <textarea required name="content" placeholder="내용 입력" />
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

export default CreatePost;
