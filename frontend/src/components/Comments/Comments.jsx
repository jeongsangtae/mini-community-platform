import { useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
// import CommentForm from "./CommentForm";
// import classes from "./Comments.module.css";
import Comment from "./Comment";
import CreateComment from "./CreateComment";

const Comments = () => {
  const post = useRouteLoaderData("post-detail");

  const [comments, setComments] = useState([]);
  // const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const postId = post.postId;
      const response = await fetch(
        "http://localhost:3000/posts/" + postId + "/comments",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw json({ message: "댓글 불러오기 실패" }, { status: 500 });
      }

      const resData = await response.json();
      setComments(resData.comments);
      // console.log(resData.userData);
      // setUserData(resData.userData);
    };
    fetchData();
  }, []);

  const addComment = (newComment) => {
    console.log(newComment);
    console.log(comments);
    setComments((prevComments) => [...prevComments, newComment]);
    console.log(comments);
  };

  const editComment = (editComment) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment._id === editComment._id) {
          return {
            ...comment,
            content: editComment.content,
            date: editComment.date,
          };
        }
        return comment;
      });
    });
    console.log(comments);
  };

  const deleteComment = (commentId) => {
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
                name={comment.name}
                content={comment.content}
                date={comment.date}
                onDeleteCommentData={deleteComment}
                onEditCommentData={editComment}
              />
            );
          })}
        </ul>
      )}
      <CreateComment
        method="POST"
        onAddCommentData={addComment}
        // userData={userData}
      />
    </>
  );
};

export default Comments;
