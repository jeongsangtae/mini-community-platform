import Reply from "../Replies/Reply";

import { useState } from "react";

const Replies = () => {
  const [replies, setReplies] = useState([]);

  return (
    <>
      {replies > 0 && (
        <ul>
          {replies.map((reply) => {
            return <Reply />;
          })}
        </ul>
      )}
    </>
  );
};

export default Replies;
