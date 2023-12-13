import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ onAddPost }) => {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const changeTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  const changeNameHandler = (event) => {
    setName(event.target.value);
  };

  const changeContentHandler = (event) => {
    setContent(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const postData = {
      id: Math.random(),
      title: title,
      name: name,
      content: content,
    };

    onAddPost(postData);
  };

  const closeHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <p>게시글 추가 페이지</p>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="title">제목</label>
          <input
            required
            type="text"
            id="title"
            name="title"
            onChange={changeTitleHandler}
          />
        </div>
        <div>
          <label htmlFor="name">작성자</label>
          <input
            required
            type="text"
            id="name"
            name="name"
            onChange={changeNameHandler}
          />
        </div>
        <div>
          <textarea
            required
            name="content"
            placeholder="내용 입력"
            onChange={changeContentHandler}
          />
        </div>
        <div>
          <button type="button" onClick={closeHandler}>
            Cancel
          </button>
          <button>Submit</button>
        </div>
      </form>
    </>
  );
};

export default CreatePost;
