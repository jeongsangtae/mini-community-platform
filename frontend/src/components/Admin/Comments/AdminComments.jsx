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

  useEffect(() => {
    const fetchData = async () => {
      const postId = post.postId;
      const response = await fetch(
        "http://localhost:3000/admin/posts/" + postId + "/comments",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw json({ message: "댓글 불러오기 실패" }, { status: 500 });
      }

      const resData = await response.json();
      setComments(resData.comments);
    };
    fetchData();
  }, []);

  const deleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  const totalRepliesHandler = (repliesValue) => {
    setTotalReplies((prevValue) => prevValue + repliesValue);
  };

  return (
    <div className={classes["comment-container"]}>
      <p className={classes["total-comment"]}>
        댓글 <span>{comments.length + totalReplies}</span>
      </p>

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
