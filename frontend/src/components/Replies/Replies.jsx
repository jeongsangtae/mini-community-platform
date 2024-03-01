import { useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";

import Reply from "../Replies/Reply";
import ReplyForm from "./ReplyForm";

const Replies = ({ commentId, onReplyToggle }) => {
  const [replies, setReplies] = useState([]);
  const [replyToggle, setReplyToggle] = useState(false);
  const post = useRouteLoaderData("post-detail");

  useEffect(() => {
    const fetchData = async () => {
      const postId = post.postId;
      const response = await fetch(
        "http://localhost:3000/posts/" + postId + "/replies"
      );

      if (!response.ok) {
        throw json({ message: "답글 불러오기 실패" }, { status: 500 });
      }

      const resData = await response.json();
      setReplies(resData.replies);
    };

    fetchData();
  }, []);

  const replyToggleHandler = () => {
    setReplyToggle(!replyToggle);
  };

  const addReply = (newReply) => {
    console.log(newReply);
    console.log(replies);
    setReplies((prevReplies) => [...prevReplies, newReply]);
    console.log(replies);
  };

  const editReply = (updateReply) => {
    console.log(updateReply);
    console.log(updateReply.replyId);
    console.log(replies);
    setReplies((prevReplies) => {
      return prevReplies.map((reply) => {
        if (reply._id === updateReply._id) {
          return { ...reply, content: updateReply.content };
        }
        return reply;
      });
    });
    console.log(replies);
  };

  const deleteReply = (replyId) => {
    setReplies((prevReplies) =>
      prevReplies.filter((reply) => reply._id !== replyId)
    );
    console.log(replyId);
    console.log(replies);
  };

  return (
    <>
      <button type="button" onClick={replyToggleHandler}>
        답글쓰기
      </button>
      {replyToggle && (
        <ReplyForm
          method="POST"
          commentId={commentId}
          onAddReplyData={addReply}
          onReplyToggle={replyToggleHandler}
        />
      )}
      {replies.length > 0 && (
        <ul>
          {replies.map((reply) => {
            return (
              <Reply
                key={reply._id}
                replyId={reply._id}
                content={reply.content}
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
