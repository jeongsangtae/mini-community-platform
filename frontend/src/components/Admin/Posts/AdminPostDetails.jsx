import { useState, useContext } from "react";
import { useRouteLoaderData, useSubmit } from "react-router-dom";
import { MoreVertical } from "react-feather";

import AdminComments from "../Comments/AdminComments";
import AuthContext from "../../../store/auth-context";
import LoadingIndicator from "../../UI/LoadingIndicator";
import classes from "./AdminPostDetails.module.css";

const AdminPostDetails = () => {
  const authCtx = useContext(AuthContext);
  const post = useRouteLoaderData("admin-post-detail");
  const submit = useSubmit();

  const [dropdownToggle, setDropdownToggle] = useState(false);

  // 게시글 로드가 완료되지 않은 경우 로딩 표시
  if (!post) {
    return <LoadingIndicator />;
  }

  // 게시글 삭제 함수
  const postDeleteHandler = () => {
    submit(null, { method: "delete" });
  };

  const dropdownButtonHandler = (event) => {
    // 상위 요소로 이벤트가 전파되는 것을 방지
    event.stopPropagation();
    setDropdownToggle(!dropdownToggle);
  };

  // 드롭다운 메뉴 외부 클릭 시 닫히는 함수
  const dropdownCloseHandler = () => {
    setDropdownToggle(false);
  };

  // 게시글 작성자와 현재 사용자가 동일할 경우에만 활성화되는 버튼 스타일
  const actionsButtonClass =
    post.email === authCtx.userInfo?.email
      ? `${classes.actions} ${classes[authCtx.themeClass]}`
      : `${classes.actions} ${classes[authCtx.themeClass]} ${classes.opacity}`;

  const iconButtonClass =
    post.email === authCtx.userInfo?.email
      ? `${classes.icon}`
      : `${classes.icon} ${classes.opacity}`;

  return (
    <div
      className={`${classes.background} ${classes[authCtx.themeClass]}`}
      onClick={dropdownCloseHandler}
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
            <span>제목</span>
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
              className={iconButtonClass}
            />

            {dropdownToggle && (
              <div
                className={`${classes.dropdown} ${classes[authCtx.themeClass]}`}
              >
                <button type="button" onClick={postDeleteHandler}>
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>

        <p
          className={`${classes.underline} ${classes[authCtx.themeClass]}`}
        ></p>

        <div
          className={`${classes["post-detail"]} ${classes[authCtx.themeClass]}`}
        >
          <p className={classes.contents}>{post.content}</p>
        </div>

        <p
          className={`${classes.underline} ${classes[authCtx.themeClass]}`}
        ></p>

        <div className={actionsButtonClass}>
          <button type="button" onClick={postDeleteHandler}>
            삭제
          </button>
        </div>
        <div>
          <AdminComments />
        </div>
      </div>
    </div>
  );
};

export default AdminPostDetails;
