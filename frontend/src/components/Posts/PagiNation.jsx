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

  return (
    <>
      {firstPageButton && (
        <>
          <Link>{leftDoubleArrow}</Link>
          <Link>이전</Link>
        </>
      )}
      {lastPageButton && (
        <>
          <Link>{rightDoubleArrow}</Link>
          <Link>다음</Link>
        </>
      )}
    </>
  );
};

export default Pagination;
