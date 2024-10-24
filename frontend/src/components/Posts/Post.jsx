import { useContext } from "react";
import { Link } from "react-router-dom";

import UIContext from "../../store/ui-context";
import classes from "./Post.module.css";

const Post = ({ num, title, name, date, content, count }) => {
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const titleLinesToShow = 1; // 미리보기로 보여줄 제목 줄 수

  const maxTitleLength = uiCtx.isDesktop ? 30 : 10; // 제목에서 제한할 길이 수
  const maxContentLength = uiCtx.isDesktop ? 100 : 50; // 내용에서 제한할 길이 수

  const lineBreakCharacterLength = uiCtx.isDesktop ? 50 : 30; // 줄바꿈이 적용될 글자 수

  const previewTitle = title
    .split("\n")
    .slice(0, titleLinesToShow)
    .map((line) =>
      line.length > maxTitleLength
        ? line.slice(0, maxTitleLength) + "..."
        : line
    )
    .join("\n"); // 미리보기로 보여줄 줄 수를 잘라내고 다시 합쳐서 보여주도록 구성

  const trimContentHandler = (
    content,
    maxContentLength,
    lineBreakCharacterLength
  ) => {
    return (
      content.split("").reduce(
        (acc, char) => {
          const { currentLength, truncatedContent } = acc;

          // 줄바꿈 문자인 경우, 줄바꿈 글자 수 만큼 더해줌
          const additionalLength = char === "\n" ? lineBreakCharacterLength : 1;

          // 현재까지의 길이 + 추가된 문자의 길이가 최대 길이 이하일 경우
          if (currentLength + additionalLength <= maxContentLength) {
            // 길이를 업데이트하고, 문자를 잘린 내용에 추가
            return {
              currentLength: currentLength + additionalLength,
              truncatedContent: truncatedContent + char,
            };
          }

          // 최대 길이를 넘은 경우, 더 이상 추가하지 않고 그대로 리턴
          return acc;
        },
        // 초기값: currentLength는 0, truncatedContent는 빈 문자열
        { currentLength: 0, truncatedContent: "" }
      ).truncatedContent + (content.length > maxContentLength ? "..." : "") // 최대 길이를 넘으면 '...'을 추가
    );
  };

  // 콘텐츠 미리보기를 위한 함수 호출
  const previewContent = trimContentHandler(
    content,
    maxContentLength,
    lineBreakCharacterLength
  );

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
          {/* 미리보기 내용과 더 많은 내용이 있을 경우 '...' 표시 */}
          <p>{previewTitle}</p>
        </div>
        <div className={classes.content}>
          {/* 미리보기 내용과 더 많은 내용이 있을 경우 '...' 표시 */}
          <p>{previewContent}</p>
        </div>
      </Link>

      <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>
    </li>
  );
};

export default Post;
