import { useState, useEffect, useContext } from "react";
import { Link, useRouteLoaderData, useSubmit } from "react-router-dom";
import Comments from "../Comments/Comments";

import AuthContext from "../../store/auth-context";
import classes from "./PostDetails.module.css";

const PostDetails = () => {
  const authCtx = useContext(AuthContext);
  const post = useRouteLoaderData("post-detail");
  const submit = useSubmit();

  const [loggedIn, setLoggedIn] = useState(false);

  if (!post) {
    // 데이터가 아직 로드되지 않은 경우 로딩 상태를 표시하거나 다른 처리를 수행할 수 있다.
    return <div>Loading...</div>;
  }

  const postDeleteHandler = () => {
    submit(null, { method: "delete" });
  };

  useEffect(() => {
    console.log(authCtx.isLoggedIn);
    setLoggedIn(authCtx.isLoggedIn);
  }, [authCtx]);

  const actionsButtonClass = loggedIn
    ? `${classes.actions}`
    : `${classes.actions} ${classes.opacity}`;

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
          <Comments />
        </div>
        <div className={actionsButtonClass}>
          <Link to="edit">수정</Link>
          <button type="button" onClick={postDeleteHandler}>
            삭제
          </button>
        </div>
      </div>
    </>
  );
};

export default PostDetails;
