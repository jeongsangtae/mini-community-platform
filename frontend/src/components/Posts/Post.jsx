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
    const result = content.split("").reduce(
      (acc, char) => {
        const { currentLength, truncatedContent, exceeded } = acc;

        // 이미 최대 길이를 초과한 경우 그대로 반환
        if (exceeded) return acc;

        // 줄바꿈일 경우 추가 길이 반영
        const additionalLength = char === "\n" ? lineBreakCharacterLength : 1;
        const newLength = currentLength + additionalLength;

        // 최대 길이를 초과하면 exceeded를 true로 설정하고 '...' 추가
        if (newLength > maxContentLength) {
          return {
            ...acc,
            truncatedContent: truncatedContent + "...",
            exceeded: true, // 초과 상태 플래그를 true로 설정
          };
        }

        // 현재 문자를 추가하고 길이를 갱신
        return {
          currentLength: newLength,
          truncatedContent: truncatedContent + char,
          exceeded: false, // 초과 상태 플래그를 false로 설정
        };
      },
      { currentLength: 0, truncatedContent: "", exceeded: false } // 초기값 설정
    );

    return result.truncatedContent; // 잘린 문자열 반환
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
        <div className={classes.title}>
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
