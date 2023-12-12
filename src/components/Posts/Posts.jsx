import { Link } from "react-router-dom";

const Posts = () => {
  return (
    <>
      <p>게시글~</p>
      <Link to="create-post">게시글 추가</Link>
    </>
  );
};

export default Posts;
