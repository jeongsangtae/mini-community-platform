import { useContext } from "react";
import { Link } from "react-router-dom";

import UIContext from "../../../store/ui-context";
import classes from "./AdminPost.module.css";

const AdminPost = ({ num, title, name, date, content, count }) => {
  const uiCtx = useContext(UIContext);

  const lines = content.split("\n"); // 게시글 내용에서 줄바꿈 기준으로 분할
  const linesToShow = 2; // 미리보기로 보여줄 줄 수
  // 미리보기로 보여줄 텍스트
  const truncatedText = lines.slice(0, linesToShow).join("\n");
  const moreLines = lines.length > linesToShow; // 더 많은 줄이 있는지 확인

  return (
    <li className={classes["post-wrapper"]}>
      {uiCtx.isDesktop ? (
        // 데스크탑 환경 UI
        <div className={`${classes.post} ${classes[uiCtx.themeClass]}`}>
          <div
            className={`${classes["info-wrap"]} ${classes[uiCtx.themeClass]}`}
          >
            <p>{num}</p>
            <span>{name}</span>
            <span>{date}</span>
            <span>조회 {count}</span>
          </div>

          {/* 게시글 제목과 내용을 클릭하면 게시글 상세 페이지로 이동 */}
          <Link to={`/admin/posts/${num.toString()}`}>
            <div className={classes.title}>
              <span>제목</span>
              <p>{title}</p>
            </div>
            <div className={classes.content}>
              {/* 미리보기 내용과 더 많은 내용이 있을 경우 '...' 표시 */}
              <p>
                {truncatedText} {moreLines && "..."}
              </p>
            </div>
          </Link>
        </div>
      ) : (
        // 모바일 UI
        <div
          className={`${classes["mobile-post"]} ${classes[uiCtx.themeClass]}`}
        >
          <div className={classes["mobile-header"]}>
            <div
              className={`${classes["mobile-post-number"]} ${
                classes[uiCtx.themeClass]
              }`}
            >
              <span>{num}</span>
            </div>

            <div className={classes["mobile-info"]}>
              <span>{name}</span>
              <div className={classes["mobile-date-and-views"]}>
                <span>{date}</span>
                <span>조회 {count}</span>
              </div>
            </div>
          </div>

          {/* 게시글 제목과 내용을 클릭하면 게시글 상세 페이지로 이동 */}
          <Link to={`/admin/posts/${num.toString()}`}>
            <div className={classes["mobile-title"]}>
              <span>제목</span>
              <p>{title}</p>
            </div>

            <div className={classes["mobile-content"]}>
              <p>
                {truncatedText} {moreLines && "..."}
              </p>
            </div>
          </Link>
        </div>
      )}

      <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>
    </li>
  );
};

export default AdminPost;
