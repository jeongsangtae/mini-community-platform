import CommentEdit from "./CommentEdit";
import CreateComment from "./CreateComment";
import CommentForm from "./CommentForm";

const Comments = () => {
  const commentHandler = () => {};
  return (
    <>
      <p>댓글</p>
      <CreateComment />
      <div>
        <button>수정</button>
        <button>삭제</button>
      </div>
    </>
  );
};

export default Comments;
