import { useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import CreateComment from "./CreateComment";
import CommentEdit from "./CommentEdit";
import CommentForm from "./CommentForm";

const Comments = () => {
  const post = useRouteLoaderData("post-detail");

  const fetchData = async () => {
    const postId = post.postId;
    console.log(postId);
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/comments"
    );

    if (!response.ok) {
      throw json({ message: "댓글 추가 실패" }, { status: 500 });
    }

    console.log(response);

    const resData = await response.json();
    return resData;
  };

  console.log(fetchData.comment);

  // useEffect(() => {
  //   const fetchData = async ()=> {
  //     try {
  //       const postId = post.postId;
  //       const response = await fetch("http://localhost:3000/posts/" + postId + "/comments")

  //       if (!response.ok) {
  //         throw json({ message: "댓글 추가 실패" }, { status: 500 });
  //       }
  //     }
  //   }
  // }, [])
  return (
    <>
      <p>{fetchData.content}</p>
      <CreateComment />
      <div>
        {/* <button>수정</button> */}
        {/* <button>삭제</button> */}
      </div>
      <button onClick={fetchData}>테스트버튼</button>
    </>
  );
};

export default Comments;
