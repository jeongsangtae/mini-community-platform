import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import Comment from "./Comment";
import CreateComment from "./CreateComment";
import classes from "./Comments.module.css";

const Comments = () => {
  const authCtx = useContext(AuthContext);
  const post = useRouteLoaderData("post-detail");

  const [comments, setComments] = useState([]);
  const [totalReplies, setTotalReplies] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const postId = post.postId;
      // 서버에서 특정 게시물에 대한 댓글을 가져오는 API 호출
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
      // 가져온 댓글 데이터를 상태로 설정
      setComments(resData.comments);
    };
    fetchData();
  }, []);

  const addComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
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
  };

  const deleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  // 답글 수를 업데이트하는 함수
  const totalRepliesHandler = (repliesValue) => {
    setTotalReplies((prevValue) => prevValue + repliesValue);
  };

  return (
    <div className={classes["comment-container"]}>
      {/* 전체 댓글 및 답글 수 표시 */}
      <p className={classes["total-comment"]}>
        댓글 <span>{comments.length + totalReplies}</span>
      </p>
      <CreateComment
        method="POST"
        onAddCommentData={addComment}
        // userData={userData}
      />
      {/* 댓글이 있을 경우에만 렌더링 */}
      {comments.length > 0 && (
        <ul className={`${classes.comments} ${classes[authCtx.themeClass]}`}>
          {comments.map((comment) => {
            return (
              <Comment
                key={comment._id}
                commentId={comment._id}
                name={comment.name}
                email={comment.email}
                content={comment.content}
                date={comment.date}
                onDeleteCommentData={deleteComment}
                onEditCommentData={editComment}
                onRepliesValue={totalRepliesHandler}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Comments;
