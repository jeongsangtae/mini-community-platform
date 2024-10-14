import { useContext } from "react";
import { Link } from "react-router-dom";

import UIContext from "../../store/ui-context";
import classes from "./Post.module.css";

const Post = ({ num, title, name, date, content, count }) => {
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const lines = content.split("\n"); // 게시글 내용에서 줄바꿈 기준으로 분할
  const linesToShow = 2; // 미리보기로 보여줄 줄 수
  // 미리보기로 보여줄 텍스트
  const truncatedText = lines.slice(0, linesToShow).join("\n");
  const moreLines = lines.length > linesToShow; // 더 많은 줄이 있는지 확인

  // 조회수를 증가시키기 위한 함수
  const postCountHandler = async () => {
    try {
      await fetch(`${apiURL}/posts/${num}/count`, {
        method: "POST",
        body: JSON.stringify(),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch (error) {
      console.error("조회수 상승 에러", error);
    }
  };

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
        </div>
      ) : (
        // 모바일 환경 UI
        <div className={`${classes.post} ${classes[uiCtx.themeClass]}`}>
          <div className={classes["info-circle"]}>
            <div
              className={`${classes["post-number"]} ${
                classes[uiCtx.themeClass]
              }`}
            >
              <span>{num}</span>
            </div>

            <div className={classes.info}>
              <span>{name}</span>
              <div
                className={`${classes["date-and-views"]} ${
                  classes[uiCtx.themeClass]
                }`}
              >
                <span>{date}</span>
                <span>조회 {count}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 게시글 제목과 내용을 클릭하면 게시글 상세 페이지로 이동 */}
      <Link
        to={`/posts/${num.toString()}`}
        className={`${classes.link} ${classes[uiCtx.themeClass]}`}
        onClick={postCountHandler}
      >
        <div className={`${classes.title} ${classes[uiCtx.themeClass]}`}>
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

      <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>
    </li>
  );
};

export default Post;
