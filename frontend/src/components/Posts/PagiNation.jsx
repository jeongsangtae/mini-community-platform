const Pagination = ({
  page,
  totalPages,
  firstPageGroup,
  lastPageGroup,
  onPageChange,
}) => {
  const firstPageButton = "<<";
  const lastPageButton = ">>";

  const pageChangeHandler = (pageNum) => {
    onPageChange(pageNum);
  };

  // let firstPageButton = totalPages > 1 && page > 1;
  // let lastPageButton = page < totalPages;

  // const pageButtons = [];

  // for (let i = firstPageGroup; i <= lastPageGroup; i++) {
  //   pageButtons.push(
  //     <Link key={i} to={`/posts?page=${i}`}>
  //       {i}
  //     </Link>
  //   );
  // }

  // const pageButtons = Array.from({
  //   length: lastPageGroup - firstPageGroup + 1,
  // }).map((_, index) => {
  //   const i = index + firstPageGroup;
  //   return (
  //     <Link key={i} to={`/posts?page=${i}`}>
  //       {i}
  //     </Link>
  //   );
  // });

  return (
    <>
      {/* {firstPageButton && (
        <>
          <Link>{leftDoubleArrow}</Link>
          <Link>이전</Link>
        </>
      )}
      {pageButtons}
      {lastPageButton && (
        <>
          <Link>다음</Link>
          <Link>{rightDoubleArrow}</Link>
        </>
      )} */}
      {totalPages > 1 && (
        <>
          {page > 1 ? (
            <>
              <button onClick={() => pageChangeHandler(1)}>
                {firstPageButton}
              </button>
              <button onClick={() => pageChangeHandler(page - 1)}>이전</button>
            </>
          ) : (
            <>
              <span className="disabled">{firstPageButton}</span>
              <span className="disabled">이전</span>
            </>
          )}

          {Array.from(
            { length: lastPageGroup - firstPageGroup + 1 },
            (_, index) => {
              const pageNumber = firstPageGroup + index;
              return (
                <button
                  key={pageNumber}
                  onClick={() => pageChangeHandler(pageNumber)}
                  className={pageNumber === page ? "on" : ""}
                >
                  {pageNumber}
                </button>
              );
            }
          )}

          {page < totalPages ? (
            <>
              <button onClick={() => pageChangeHandler(page + 1)}>다음</button>
              <button onClick={() => pageChangeHandler(totalPages)}>
                {lastPageButton}
              </button>
            </>
          ) : (
            <>
              <span className="disabled">다음</span>
              <span className="disabled">{lastPageButton}</span>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Pagination;
