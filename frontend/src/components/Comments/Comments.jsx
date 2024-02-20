import CreateComment from "./CreateComment";
import CommentEdit from "./CommentEdit";
import CommentForm from "./CommentForm";

const Comments = () => {
  const commentHandler = async () => {
    const response = await fetch("http://localhost:3000/posts/comments", {});
  };
  return (
    <>
      <CreateComment />
      <div>
        {/* <button>수정</button> */}
        {/* <button>삭제</button> */}
      </div>
    </>
  );
};

export default Comments;
