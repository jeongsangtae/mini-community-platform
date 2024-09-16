import { useState, useContext } from "react";
import { useRouteLoaderData, useSubmit } from "react-router-dom";
import { MoreVertical } from "react-feather";

import AdminComments from "../Comments/AdminComments";
import LoadingIndicator from "../../UI/LoadingIndicator";

import UIContext from "../../../store/ui-context";
import classes from "./AdminPostDetails.module.css";

const AdminPostDetails = () => {
  const post = useRouteLoaderData("admin-post-detail");
  const uiCtx = useContext(UIContext);
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

  return (
    <div
      className={`${classes.background} ${classes[uiCtx.themeClass]}`}
      onClick={dropdownCloseHandler}
    >
      <div
        className={`${classes["post-container"]} ${classes[uiCtx.themeClass]}`}
      >
        <h1 className={`${classes.heading} ${classes[uiCtx.themeClass]}`}>
          게시글 세부 페이지
        </h1>

        <div className={classes["post-wrap"]}>
          <div className={`${classes.title} ${classes[uiCtx.themeClass]}`}>
            <span>제목</span>
            <p>{post.title}</p>
          </div>

          <div
            className={`${classes["info-wrap"]} ${classes[uiCtx.themeClass]}`}
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
                className={`${classes.dropdown} ${classes[uiCtx.themeClass]}`}
              >
                <button type="button" onClick={postDeleteHandler}>
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>

        <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>

        <div
          className={`${classes["post-detail"]} ${classes[uiCtx.themeClass]}`}
        >
          <p>{post.content}</p>
        </div>

        <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>

        <div className={`${classes.actions} ${classes[uiCtx.themeClass]}`}>
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
