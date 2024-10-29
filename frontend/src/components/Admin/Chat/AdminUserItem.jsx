import { useContext } from "react";

import UIContext from "../../../store/ui-context";
import classes from "./AdminUserItem.module.css";

const AdminUserItem = ({
  userId,
  name,
  email,
  lastMessageContent,
  lastMessageDate,
  selectUser,
}) => {
  const uiCtx = useContext(UIContext);

  const maxLastMessageLength = 10;
  const lineBreakCharacterLength = 10;

  // 좀 더 복잡하지 않고, 직관적인 코드 (for of 사용)
  // const trimContentHandler = (content = "", maxLength, lineBreakLength) => {
  //   let currentLength = 0;
  //   let truncatedContent = "";

  //   for (const char of content) {
  //     const additionalLength = char === "\n" ? lineBreakLength : 1;
  //     const newLength = currentLength + additionalLength;

  //     // 최대 길이를 초과하면 '...' 추가 후 종료
  //     if (newLength > maxLength) {
  //       truncatedContent += "...";
  //       break;
  //     }

  //     truncatedContent += char;
  //     currentLength = newLength;
  //   }

  //   return truncatedContent; // 잘린 문자열 반환
  // };

  const trimContentHandler = (
    lastMessageContent,
    maxLastMessageLength,
    lineBreakCharacterLength
  ) => {
    const result = lastMessageContent?.split("").reduce(
      (acc, char) => {
        const { currentLength, truncatedContent, exceeded } = acc;

        // 이미 최대 길이를 초과한 경우 그대로 반환
        if (exceeded) return acc;

        // 줄바꿈일 경우 추가 길이 반영
        const additionalLength = char === "\n" ? lineBreakCharacterLength : 1;
        const newLength = currentLength + additionalLength;

        // 최대 길이를 초과하면 exceeded를 true로 설정하고 '...' 추가
        if (newLength > maxLastMessageLength) {
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

    return result?.truncatedContent; // 잘린 문자열 반환
  };

  // 마지막 메시지 미리보기를 위한 함수 호출
  const previewLastMessage = trimContentHandler(
    lastMessageContent,
    maxLastMessageLength,
    lineBreakCharacterLength
  );

  // 사용자 항목을 클릭했을 때 호출되는 함수
  const clickHandler = () => {
    // 선택된 사용자의 ID와 이름을 selectUser 함수로 전달
    selectUser(userId, name);
  };

  return (
    <li className={`${classes["item-container"]} ${classes[uiCtx.themeClass]}`}>
      <button
        onClick={clickHandler}
        className={`${classes["item-select-button"]} ${
          classes[uiCtx.themeClass]
        }`}
      >
        <div className={classes["item-left"]}>
          <div
            className={`${classes["user-name"]} ${classes[uiCtx.themeClass]}`}
          >
            {name}
          </div>
          <div className={classes["user-email"]}>{email}</div>
        </div>

        <div className={classes["item-right"]}>
          <div
            className={`${classes["last-message-content"]} ${
              classes[uiCtx.themeClass]
            }`}
          >
            {previewLastMessage}
            {/* {lastMessageContent} */}
          </div>
          <div className={classes["last-message-date"]}>{lastMessageDate}</div>
        </div>
      </button>
    </li>
  );
};

export default AdminUserItem;
