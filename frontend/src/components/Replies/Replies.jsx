import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import Reply from "./Reply";
import ReplyForm from "./ReplyForm";
import AuthContext from "../../store/auth-context";
import classes from "./Replies.module.css";

const Replies = ({ commentId, replyToggle, onReplyToggle, repliesLength }) => {
  const post = useRouteLoaderData("post-detail");
  const authCtx = useContext(AuthContext);

  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const postId = post.postId;
      const response = await fetch(
        "http://localhost:3000/posts/" + postId + "/" + commentId + "/replies"
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

  const addReply = (newReply) => {
    setReplies((prevReplies) => [...prevReplies, newReply]);
  };

  const editReply = (editReply) => {
    setReplies((prevReplies) => {
      return prevReplies.map((reply) => {
        if (reply._id === editReply._id) {
          return { ...reply, content: editReply.content, date: editReply.date };
        }
        return reply;
      });
    });
  };

  const deleteReply = (replyId) => {
    setReplies((prevReplies) =>
      prevReplies.filter((reply) => reply._id !== replyId)
    );
  };

  return (
    <>
      {replyToggle && (
        <ReplyForm
          method="POST"
          commentId={commentId}
          onAddReplyData={addReply}
          onReplyToggle={onReplyToggle}
        />
      )}
      {replies.length > 0 && (
        <p
          className={`${classes.underline} ${classes[authCtx.themeClass]}`}
        ></p>
      )}
      {replies.length > 0 && (
        <ul>
          {replies.map((reply) => {
            return (
              <Reply
                key={reply._id}
                replyId={reply._id}
                name={reply.name}
                email={reply.email}
                content={reply.content}
                date={reply.date}
                commentId={commentId}
                onDeleteReplyData={deleteReply}
                onEditReplyData={editReply}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Replies;
