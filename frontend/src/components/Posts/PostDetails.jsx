import { Link, redirect, useRouteLoaderData } from "react-router-dom";

import classes from "./PostDetails.module.css";

const PostDetails = () => {
  const post = useRouteLoaderData("post-detail");

  if (!post) {
    // 데이터가 아직 로드되지 않은 경우 로딩 상태를 표시하거나 다른 처리를 수행할 수 있습니다.
    return <div>Loading...</div>;
  }

  // const postDeleteHandler = async () => {
  //   const postId = post.postId;
  //   const response = await fetch(
  //     "http://localhost:3000/posts/" + postId + "/delete",
  //     {
  //       method: "POST",
  //       body: JSON.stringify(),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   if (!response.ok) {
  //     throw json({ message: "Could not delete post." }, { status: 500 });
  //   }

  //   return redirect("/posts");
  // };

  const postDeleteHandler = () => {
    post;
  };

  return (
    <>
      <h1 className={classes.heading}>게시글 세부 페이지</h1>
      <div className={classes["post-detail"]}>
        <div>
          <p>제목</p>
          <p className={classes.contents}>{post.title}</p>
        </div>
        <div>
          <p>이름</p>
          <p className={classes.contents}>{post.name}</p>
        </div>
        <div>
          <p>내용</p>
          <p className={classes.contents}>{post.content}</p>
        </div>
        <div>
          <Link to="edit">수정</Link>
          <button onClick={postDeleteHandler}>삭제</button>
        </div>
      </div>
    </>
  );
};

export default PostDetails;
