import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import AuthContext from "../../../store/auth-context";
import AdminComment from "./AdminComment";
import classes from "./AdminComments.module.css";

const AdminComments = () => {
  const authCtx = useContext(AuthContext);
  const post = useRouteLoaderData("admin-post-detail");

  const [comments, setComments] = useState([]);
  const [totalReplies, setTotalReplies] = useState(0);

  // 컴포넌트가 마운트될 때 댓글 데이터를 서버에서 가져오는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      const postId = post.postId;

      try {
        // 서버에서 특정 게시글에 대한 댓글을 가져오는 API 호출
        const response = await fetch(
          "http://localhost:3000/admin/posts/" + postId + "/comments",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("댓글 불러오기 실패");
        }

        const resData = await response.json();

        setComments(resData.comments);
      } catch (error) {
        authCtx.errorHelper(
          error,
          "댓글 조회 중에 문제가 발생했습니다. 다시 시도해 주세요."
        );
      }
    };

    fetchData();
  }, []);

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

      {/* 댓글이 있을 경우에만 렌더링 */}
      {comments.length > 0 && (
        <ul className={`${classes.comments} ${classes[authCtx.themeClass]}`}>
          {comments.map((comment) => {
            return (
              <AdminComment
                key={comment._id}
                commentId={comment._id}
                name={comment.name}
                email={comment.email}
                content={comment.content}
                date={comment.date}
                onDeleteCommentData={deleteComment}
                onRepliesValue={totalRepliesHandler}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminComments;
