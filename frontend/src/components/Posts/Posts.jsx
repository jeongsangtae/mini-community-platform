import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
// import Pagination from "./Pagination";

import Post from "./Post";
import classes from "./Posts.module.css";

const Posts = () => {
  // const resData = useLoaderData();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firstPageGroup, setFirstPageGroup] = useState(1);
  const [lastPageGroup, setLastPageGroup] = useState(1);

  const firstPageButton = "<<";
  const lastPageButton = ">>";

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3000/posts?page=${page}`);
      console.log(response);
      const resData = await response.json();
      setPosts(resData.posts);
      setTotalPages(resData.totalPages);
      setFirstPageGroup(resData.firstPageGroup);
      setLastPageGroup(resData.lastPageGroup);
    };
    fetchData();
  }, [page]);

  // const reversedPosts = posts.slice().reverse();

  // const pageChangeHandler = (anotherPage) => {};

  const handlePageChange = (newPage) => {
    navigate(`/posts?page=${newPage}`);

    setPage(newPage);
  };

  return (
    <>
      <h1 className={classes.heading}>게시글</h1>
      <div className={classes["posts-item"]}>
        <p>번호</p>
        <p>제목</p>
        <p>글쓴이</p>
        <p>날짜</p>
      </div>
      {posts.length > 0 && (
        <ul className={classes.posts}>
          {posts.map((post) => {
            return (
              <Post
                key={post.postId}
                num={post.postId}
                title={post.title}
                name={post.name}
                date={post.date}
              />
            );
          })}
        </ul>
      )}
      <div>
        {totalPages > 1 && (
          <>
            {page > 1 ? (
              <>
                <button onClick={() => handlePageChange(1)}>
                  {firstPageButton}
                </button>
                <button onClick={() => handlePageChange(page - 1)}>이전</button>
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
                    onClick={() => handlePageChange(pageNumber)}
                    className={pageNumber === page ? "on" : ""}
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}

            {page < totalPages ? (
              <>
                <button onClick={() => handlePageChange(page + 1)}>다음</button>
                <button onClick={() => handlePageChange(totalPages)}>
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
      </div>
      <Link to="create-post" className={classes.add}>
        <p>게시글 추가</p>
      </Link>
    </>
  );
};

export default Posts;

// export const loader = async () => {
//   const response = await fetch("http://localhost:3000/posts");
//   const resData = await response.json();
//   return resData.posts;
// };
