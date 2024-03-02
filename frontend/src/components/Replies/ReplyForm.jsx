import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

const ReplyForm = ({
  method,
  replyData,
  commentId,
  onAddReplyData,
  onEditReplyData,
  onReplyToggle,
}) => {
  const [reply, setReply] = useState("");
  const post = useRouteLoaderData("post-detail");

  const replyinputHandler = (event) => {
    setReply(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    let contentTrimConfrim = reply.trim() !== "" ? reply : replyData.content;

    const postId = post.postId;

    let requestBody = {
      content: contentTrimConfrim,
    };

    if (method === "POST") {
      requestBody.commentId = commentId;
    }

    if (method === "PATCH") {
      requestBody.replyId = replyData.replyId;
    }

    // let requestBody = {
    //   content: reply,
    //   ...(method === "POST" && { commentId: commentId }),
    //   ...(method === "PATCH" && { replyId: replyData.replyId }),
    // };

    // let requestBody = {
    //   content: reply,
    //   ...(method === "POST" ? { commentId: commentId } : { replyId: replyData.replyId }),
    // };

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
    } else if (response.ok && method === "PATCH") {
      const resData = await response.json();
      onEditReplyData(resData.updateReply);
    }

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
          defaultValue={replyData ? replyData.content : ""}
          onChange={replyinputHandler}
        />
        <button>{method === "POST" ? "등록" : "수정"}</button>
        {onReplyToggle && <button onClick={onReplyToggle}>취소</button>}
      </form>
    </>
  );
};

export default ReplyForm;
