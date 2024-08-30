import { useContext } from "react";

import UIContext from "../../store/ui-context";
import classes from "./Pagination.module.css";

const Pagination = ({
  page,
  totalPages,
  firstPageGroup,
  lastPageGroup,
  onPageChange,
}) => {
  const uiCtx = useContext(UIContext);

  const firstPageButton = "<<";
  const lastPageButton = ">>";

  let firstPage = page > 1;
  let lastPage = page < totalPages;

  const pageChangeHandler = (pageNum) => {
    onPageChange(pageNum);
  };

  // 페이지 이동 버튼을 렌더링하는 함수
  const pageMove = (condition, label, clickEvent) => {
    return condition && <button onClick={clickEvent}>{label}</button>;
  };

  // 현재 페이지 그룹의 페이지 번호들을 생성
  const pageNumber = Array.from(
    { length: lastPageGroup - firstPageGroup + 1 },
    (_, index) => {
      const pageNumber = firstPageGroup + index;
      return (
        <button
          key={pageNumber}
          onClick={() => pageChangeHandler(pageNumber)}
          className={
            pageNumber === page
              ? `${classes.on} ${classes[uiCtx.themeClass]}` // 현재 페이지를 강조 표시
              : ""
          }
        >
          {pageNumber}
        </button>
      );
    }
  );

  return (
    <>
      {/* 페이지가 1보다 많을 때만 페이지네이션 렌더링 */}
      {totalPages > 1 && (
        <div className={`${classes.pagination} ${classes[uiCtx.themeClass]}`}>
          {pageMove(firstPage, firstPageButton, () => pageChangeHandler(1))}
          {pageMove(firstPage, "이전", () => pageChangeHandler(page - 1))}

          {pageNumber}

          {pageMove(lastPage, "다음", () => pageChangeHandler(page + 1))}
          {pageMove(lastPage, lastPageButton, () =>
            pageChangeHandler(totalPages)
          )}
        </div>
      )}
    </>
  );
};

export default Pagination;
