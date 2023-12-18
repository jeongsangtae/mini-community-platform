import { useNavigate, Form } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <p>게시글 추가 페이지</p>
      <Form method="post">
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
        <div>
          <button type="button" onClick={closeHandler}>
            Cancel
          </button>
          <button>Submit</button>
        </div>
      </Form>
    </>
  );
};

export default CreatePost;

// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const postData = Object.fromEntries(formData);
//   // formData.get("body");
//   await fetch("http://localhost:3000/posts", {
//     method: "POST",
//     body: JSON.stringify(postData),
//     headers: { "Content-Type": "application/json" },
//   });

//   return redirect("/posts");
// };
