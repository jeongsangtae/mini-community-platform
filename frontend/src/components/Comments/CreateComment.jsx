import { useState } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";

const CreateComment = () => {
  const [comment, setComment] = useState("");
  const post = useRouteLoaderData("post-detail");

  // const testHandler = () => {
  //   const postId = post.postId;
  //   console.log(post);
  //   console.log(postId);
  // };

  const commentChangeHandler = (event) => {
    const commentContent = event.target.value;
    console.log(commentContent);
    setComment(commentContent);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    console.log(comment);

    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/comments",
      {
        method: "POST",
        body: JSON.stringify({ content: comment }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw json({ message: "댓글 추가 실패" }, { status: 500 });
    }

    console.log("add comments");

    return redirect("/posts/" + postId);
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        {/* <p></p> */}
        <textarea
          placeholder="내용 입력"
          rows="5"
          name="content"
          onChange={commentChangeHandler}
        />
        <button>등록</button>
      </form>
      {/* <button onClick={testHandler}>테스트 버튼</button> */}
    </>
  );
};

export default CreateComment;
