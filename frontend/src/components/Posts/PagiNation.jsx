import classes from "./Pagination.module.css";

const Pagination = ({
  page,
  totalPages,
  firstPageGroup,
  lastPageGroup,
  onPageChange,
}) => {
  const firstPageButton = "<<";
  const lastPageButton = ">>";

  let firstPage = page > 1;
  let lastPage = page < totalPages;

  const pageChangeHandler = (pageNum) => {
    onPageChange(pageNum);
  };

  const pageMove = (condition, label, clickEvent) => {
    return condition && <button onClick={clickEvent}>{label}</button>;
  };

  const pageNumber = Array.from(
    { length: lastPageGroup - firstPageGroup + 1 },
    (_, index) => {
      const pageNumber = firstPageGroup + index;
      return (
        <button
          key={pageNumber}
          onClick={() => pageChangeHandler(pageNumber)}
          className={pageNumber === page ? classes.on : ""}
        >
          {pageNumber}
        </button>
      );
    }
  );

  return (
    <>
      {totalPages > 1 && (
        <div className={classes.pagination}>
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
