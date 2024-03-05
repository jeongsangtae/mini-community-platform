import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
// import CommentForm from "./CommentForm";
// import classes from "./Comments.module.css";
import Comment from "./Comment";
import CreateComment from "./CreateComment";

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
        throw json({ message: "댓글 불러오기 실패" }, { status: 500 });
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

  const editComment = (editComment) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment._id === editComment._id) {
          return { ...comment, content: editComment.content };
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
                content={comment.content}
                onDeleteCommentData={deleteComment}
                onEditCommentData={editComment}
              />
            );
          })}
        </ul>
      )}
      <CreateComment method="POST" onAddCommentData={addComment} />
    </>
  );
};

export default Comments;
