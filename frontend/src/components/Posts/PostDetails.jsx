import { useState, useContext } from "react";
import { Link, useRouteLoaderData, useSubmit } from "react-router-dom";
import { MoreVertical } from "react-feather";

import AuthContext from "../../store/auth-context";
import Comments from "../Comments/Comments";
import LoadingIndicator from "../UI/LoadingIndicator";
import classes from "./PostDetails.module.css";

const PostDetails = () => {
  const authCtx = useContext(AuthContext);
  const post = useRouteLoaderData("post-detail");
  const submit = useSubmit();

  const [dropdownToggle, setDropdownToggle] = useState(false);

  console.log(post);

  if (!post) {
    return <LoadingIndicator />;
  }

  const postDeleteHandler = () => {
    submit(null, { method: "delete" });
  };

  const dropdownButtonHandler = () => {
    setDropdownToggle(!dropdownToggle);
  };

  const dropdownClose = () => {
    setDropdownToggle(false);
  };

  const actionsButtonClass =
    post.email === authCtx.userInfo?.email
      ? `${classes.actions}`
      : `${classes.actions} ${classes.opacity}`;

  return (
    <div
      className={`${classes.background} ${classes[authCtx.themeClass]}`}
      onClick={dropdownClose}
    >
      <div
        className={`${classes["post-container"]} ${
          classes[authCtx.themeClass]
        }`}
      >
        <h1 className={`${classes.heading} ${classes[authCtx.themeClass]}`}>
          게시글 세부 페이지
        </h1>

        <div className={classes["post-wrap"]}>
          <div className={`${classes.title} ${classes[authCtx.themeClass]}`}>
            {/* <p>제목</p> */}
            <p>{post.title}</p>
          </div>

          <div
            className={`${classes["info-wrap"]} ${classes[authCtx.themeClass]}`}
          >
            <p>{post.name}</p>
            <span>{post.date}</span>
            <span>조회 {post.count}</span>

            <MoreVertical
              onClick={dropdownButtonHandler}
              className={classes.icon}
            />
            {dropdownToggle && (
              <div
                className={`${classes.dropdown} ${classes[authCtx.themeClass]}`}
              >
                <Link to="edit">수정하기</Link>
                <button type="button" onClick={postDeleteHandler}>
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>

        <p className={classes.underline}></p>

        <div
          className={`${classes["post-detail"]} ${classes[authCtx.themeClass]}`}
        >
          <p className={classes.contents}>{post.content}</p>
        </div>

        <p className={classes.underline}></p>

        <div className={actionsButtonClass}>
          <Link to="edit">수정</Link>
          <button type="button" onClick={postDeleteHandler}>
            삭제
          </button>
        </div>
        <div>
          <Comments />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
