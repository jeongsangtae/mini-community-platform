import Reply from "../Replies/Reply";

import { useState } from "react";
import ReplyForm from "./ReplyForm";

const Replies = ({ commentId, onReplyToggle }) => {
  const [replies, setReplies] = useState([]);
  const [replyToggle, setReplyToggle] = useState(false);
  // const post = useRouteLoaderData("post-detail");

  const addReply = (newReply) => {
    setReplies((prevReplies) => [...prevReplies, newReply]);
  };

  const replyToggleHandler = () => {
    setReplyToggle(!replyToggle);
  };

  return (
    <>
      {onReplyToggle && (
        <ReplyForm
          method="POST"
          onAddReplyData={addReply}
          onReplyToggle={onReplyToggle}
        />
      )}
      {replies > 0 && (
        <ul>
          {replies.map((reply) => {
            return (
              <Reply
                key={reply._id}
                replyId={reply._id}
                commentId={commentId}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Replies;
