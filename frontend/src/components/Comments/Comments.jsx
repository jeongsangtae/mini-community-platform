import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import Comment from "./Comment";
import CreateComment from "./CreateComment";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./Comments.module.css";

const Comments = () => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const [comments, setComments] = useState([]);
  const [totalReplies, setTotalReplies] = useState(0);

  // 컴포넌트가 마운트될 때 댓글 데이터를 서버에서 가져오는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      const postId = post.postId;

      try {
        // 서버에서 특정 게시글에 대한 댓글을 가져오는 API 호출
        const response = await fetch(`${apiURL}/posts/${postId}/comments`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("댓글 조회 실패");
        }

        const resData = await response.json();
        setComments(resData.comments);
      } catch (error) {
        authCtx.errorHelper(
          error,
          "댓글을 불러오는 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
        );
      }
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
        <ul className={`${classes.comments} ${classes[uiCtx.themeClass]}`}>
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
