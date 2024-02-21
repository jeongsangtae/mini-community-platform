import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import CreateComment from "./CreateComment";
import CommentEdit from "./CommentEdit";
import CommentForm from "./CommentForm";

const Comments = () => {
  const [comments, setComments] = useState([]);
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

    const resData = await response.json();

    console.log(resData.comments);
    console.log(resData.comments.content);
    setComments(resData.comments);

    return resData;
  };

  console.log(comments);
  console.log(comments[0]);

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
      {comments.length > 0 && (
        <ul>
          {comments.map((comment) => {
            return <li>{comment.content}</li>;
          })}
        </ul>
      )}
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
