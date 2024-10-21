import { useContext } from "react";
import { Link } from "react-router-dom";

import UIContext from "../../store/ui-context";
import classes from "./Post.module.css";

const Post = ({ num, title, name, date, content, count }) => {
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const titleLinesToShow = 1; // 미리보기로 보여줄 제목 줄 수
  const contentLinesToShow = 2; // 미리보기로 보여줄 내용 줄 수

  const maxMobileTitleLength = 10;
  const maxTitleLength = 30;
  const maxContentLength = 30;

  const mobileTitleLines = title
    .split("\n")
    .map((line) =>
      line.length > maxMobileTitleLength
        ? line.slice(0, maxMobileTitleLength) + "..."
        : line
    ); // 모바일 환경에서 줄 길이 제한
  const titleLines = title
    .split("\n")
    .map((line) =>
      line.length > maxTitleLength
        ? line.slice(0, maxTitleLength) + "..."
        : line
    ); // 게시글 제목에서 줄바꿈과 길이 제한

  // const contentLines2 =

  const contentLines = content
    .split("\n")
    .map((line) =>
      line.length > maxContentLength
        ? line.slice(0, maxContentLength) + "..."
        : line
    ); // 게시글 내용에서 줄바꿈과 길이 제한

  // 모바일 환경에서 미리보기로 보여줄 제목
  const truncatedMobileTitle = mobileTitleLines
    .slice(0, titleLinesToShow)
    .join("\n");
  const moreMobileTitleLines = mobileTitleLines.length > titleLinesToShow; // 더 많은 줄이 있는지 확인

  // 미리보기로 보여줄 제목
  const truncatedTitle = titleLines.slice(0, titleLinesToShow).join("\n");
  const moreTitleLines = titleLines.length > titleLinesToShow; // 더 많은 줄이 있는지 확인

  // 미리보기로 보여줄 내용
  const truncatedContent = contentLines.slice(0, contentLinesToShow).join("\n");
  const moreContentLines = contentLines.length > contentLinesToShow; // 더 많은 줄이 있는지 확인

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
          <p>
            {uiCtx.isDesktop
              ? truncatedTitle + (moreTitleLines ? "..." : "")
              : truncatedMobileTitle + (moreMobileTitleLines ? "..." : "")}
          </p>
        </div>
        <div className={classes.content}>
          {/* 미리보기 내용과 더 많은 내용이 있을 경우 '...' 표시 */}
          <p>
            {truncatedContent} {moreContentLines && "..."}
          </p>
        </div>
      </Link>

      <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>
    </li>
  );
};

export default Post;
