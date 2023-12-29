import { Link, useLoaderData } from "react-router-dom";

const Pagination = () => {
  const resData = useLoaderData();

  const page = resData.page;
  const totalPages = resData.totalPages;
  const firstPageGroup = resData.firstPageGroup;
  const lastPageGroup = resData.lastPageGroup;

  const leftDoubleArrow = "<<";
  const rightDoubleArrow = ">>";

  let firstPageButton = totalPages > 1 && page > 1;
  let lastPageButton = page < totalPages;

  const pageButtons = [];

  for (let i = firstPageGroup; i <= lastPageGroup; i++) {
    pageButtons.push(
      <Link key={i} to={`/posts?page=${i}`}>
        {i}
      </Link>
    );
  }

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
      {firstPageButton && (
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
      )}
    </>
  );
};

export default Pagination;
