import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import CreateComment from "./CreateComment";
import CommentEdit from "./CommentEdit";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const post = useRouteLoaderData("post-detail");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const postId = post.postId;
  //     console.log(postId);
  //     const response = await fetch(
  //       "http://localhost:3000/posts/" + postId + "/comments"
  //     );

  //     if (!response.ok) {
  //       throw json({ message: "댓글 추가 실패" }, { status: 500 });
  //     }

  //     const resData = await response.json();

  //     console.log(resData.comments);
  //     console.log(resData.comments.content);
  //     setComments(resData.comments);

  //     return resData;
  //   };

  //   fetchData();
  // }, [post]);

  useEffect(() => {
    const fetchData = async (comment) => {
      const postId = post.postId;
      const response = await fetch(
        "http://localhost:3000/posts/" + postId + "/comments"
      );

      if (!response.ok) {
        throw json({ message: "댓글 추가 실패" }, { status: 500 });
      }

      const resData = await response.json();
      setComments(resData.comments);
    };
    fetchData();
  }, [post]);

  // const fetchData = async (comment) => {
  //   const postId = post.postId;
  //   console.log(postId);
  //   const response = await fetch(
  //     "http://localhost:3000/posts/" + postId + "/comments"
  //   );

  //   if (!response.ok) {
  //     throw json({ message: "댓글 추가 실패" }, { status: 500 });
  //   }

  //   const resData = await response.json();

  //   console.log(resData.comments);
  //   console.log(resData.comments.content);
  //   setComments(resData.comments);

  //   return resData;
  // };

  const addComment = (newComment) => {
    console.log(newComment);
    console.log(comments);
    setComments((prevComments) => [...prevComments, newComment]);
    console.log(comments);
  };

  console.log(comments);
  console.log(comments[0]);

  return (
    <>
      {comments.length > 0 && (
        <ul>
          {comments.map((comment) => {
            return <Comment key={comment._id} content={comment.content} />;
          })}
        </ul>
      )}
      {/* <CreateComment onCommentData={fetchData} /> */}
      <CreateComment onCommentData={addComment} />
      <div>
        {/* <button>수정</button> */}
        {/* <button>삭제</button> */}
      </div>
      {/* <button onClick={fetchData}>댓글 테스트 버튼</button> */}
    </>
  );
};

export default Comments;
