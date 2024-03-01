import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

const ReplyForm = ({ method, commentId, onAddReplyData, onReplyToggle }) => {
  const [reply, setReply] = useState();
  const post = useRouteLoaderData("post-detail");

  const replyinputHandler = (event) => {
    setReply(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const postId = post.postId;

    let requestBody = {
      content: reply,
      commentId: commentId,
    };

    // if (method === "PATCH") {
    //   requestBody.commentId = commentData.commentId;
    // }

    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/replies",
      {
        method: method,
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw json({ message: "Could not save reply." }, { status: 500 });
    } else if (response.ok && method === "POST") {
      const resData = await response.json();
      onAddReplyData(resData.newReply);
      console.log(resData.newReply);
    }
    console.log(commentId);
    onReplyToggle();
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <textarea
          required
          name="content"
          rows="5"
          placeholder="내용 입력"
          // defaultValue={commentReply ? commentReply.content : ""}
          onChange={replyinputHandler}
        />
        <button>등록</button>
        {onReplyToggle && <button onClick={onReplyToggle}>취소</button>}
      </form>
    </>
  );
};

export default ReplyForm;
