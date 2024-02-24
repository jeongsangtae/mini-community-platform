import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import CreateComment from "./CreateComment";
import CommentEdit from "./CommentEdit";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const post = useRouteLoaderData("post-detail");

  useEffect(() => {
    const fetchData = async () => {
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
  }, []);

  const addComment = (newComment) => {
    console.log(newComment);
    console.log(comments);
    setComments((prevComments) => [...prevComments, newComment]);
    console.log(comments);
  };

  const deleteComment = (commentId) => {
    // setComments((prevComments) =>
    //   prevComments.filter((comment) => comment._id !== commentId._id)
    // );
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
    console.log(commentId);
    console.log(comments);
  };

  return (
    <>
      {comments.length > 0 && (
        <ul>
          {comments.map((comment) => {
            return (
              <Comment
                key={comment._id}
                commentId={comment._id}
                content={comment.content}
                onDeleteCommentData={deleteComment}
              />
            );
          })}
        </ul>
      )}
      <CreateComment onAddCommentData={addComment} />
      <div>{/* <button>수정</button> */}</div>
    </>
  );
};

export default Comments;
