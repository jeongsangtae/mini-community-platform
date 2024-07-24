import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import AdminReply from "./AdminReply";
import AuthContext from "../../../store/auth-context";
import classes from "./AdminReplies.module.css";

const AdminReplies = ({ commentId, repliesLength }) => {
  const authCtx = useContext(AuthContext);
  const post = useRouteLoaderData("admin-post-detail");

  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const postId = post.postId;
      const response = await fetch(
        "http://localhost:3000/admin/posts/" +
          postId +
          "/" +
          commentId +
          "/replies"
      );

      if (!response.ok) {
        throw json({ message: "답글 불러오기 실패" }, { status: 500 });
      }

      const resData = await response.json();
      setReplies(resData.replies);
      repliesLength(resData.replies.length);
    };

    fetchData();
  }, []);

  const deleteReply = (replyId) => {
    setReplies((prevReplies) =>
      prevReplies.filter((reply) => reply._id !== replyId)
    );
  };

  return (
    <>
      {replies.length > 0 && (
        <p
          className={`${classes.underline} ${classes[authCtx.themeClass]}`}
        ></p>
      )}
      {replies.length > 0 && (
        <ul>
          {replies.map((reply) => {
            return (
              <AdminReply
                key={reply._id}
                replyId={reply._id}
                name={reply.name}
                email={reply.email}
                content={reply.content}
                date={reply.date}
                commentId={commentId}
                onDeleteReplyData={deleteReply}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};

export default AdminReplies;
