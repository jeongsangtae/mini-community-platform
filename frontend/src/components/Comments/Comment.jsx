import { useRouteLoaderData } from "react-router-dom";

const Comment = ({ content }) => {
  const post = useRouteLoaderData("post-detail");

  const commentDeleteHandler = async () => {
    const postId = post.postId;
    const response = await fetch(
      "http://localhost:3000/posts/" + postId + "comment",
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw json({ message: "Could not delete comment." }, { status: 500 });
    }

    console.log("Delete comment");
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
