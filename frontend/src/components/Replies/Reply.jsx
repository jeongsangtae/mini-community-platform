import { useRouteLoaderData } from "react-router-dom";

const Reply = ({ replyId, content, commentId, onDeleteReplyData }) => {
  const post = useRouteLoaderData("post-detail");

  const replyDeleteHandler = async () => {
    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/replies",
      {
        method: "DELETE",
        body: JSON.stringify({ replyId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw json({ message: "Could not delete reply." }, { status: 500 });
    } else {
      console.log(replyId);
      onDeleteReplyData(replyId);
      console.log("Delete reply");
    }
  };

  return (
    <>
      <li>
        <p>{content}</p>
        <button>수정</button>
        <button type="button" onClick={replyDeleteHandler}>
          삭제
        </button>
      </li>
    </>
  );
};

export default Reply;
