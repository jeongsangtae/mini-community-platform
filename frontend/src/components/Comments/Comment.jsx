import { useRouteLoaderData } from "react-router-dom";

const Comment = ({ commentId, content, onDeleteCommentData }) => {
  const post = useRouteLoaderData("post-detail");

  const commentDeleteHandler = async () => {
    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "/comment",
      {
        method: "DELETE",
      }
    );

    console.log(postId);

    if (!response.ok) {
      throw json({ message: "Could not delete comment." }, { status: 500 });
    } else {
      // const resData = await response.json();
      // console.log(resData);
      // console.log(resData.comment);
      // console.log(resData.comment._id);
      // onDeleteCommentData(resData.comment);
      console.log(commentId);
      onDeleteCommentData(commentId);
      console.log("Delete comment");
    }
  };

  return (
    <>
      <li>
        <p>{content}</p>
        <button type="button" onClick={commentDeleteHandler}>
          삭제
        </button>
      </li>
    </>
  );
};

export default Comment;
