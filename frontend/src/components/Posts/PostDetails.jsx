import { useContext } from "react";
import { Link, useRouteLoaderData, useSubmit } from "react-router-dom";
import Comments from "../Comments/Comments";

import AuthContext from "../../store/auth-context";
import classes from "./PostDetails.module.css";
import LoadingIndicator from "../UI/LoadingIndicator";

const PostDetails = () => {
  const authCtx = useContext(AuthContext);
  const post = useRouteLoaderData("post-detail");
  const submit = useSubmit();

  console.log(post);

  if (!post) {
    return <LoadingIndicator />;
  }

  const postDeleteHandler = () => {
    submit(null, { method: "delete" });
  };

  // useEffect(() => {
  //   console.log(authCtx.isLoggedIn);
  //   setLoggedIn(authCtx.isLoggedIn);
  // }, [authCtx]);

  const actionsButtonClass =
    post.email === authCtx.userInfo?.email
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
