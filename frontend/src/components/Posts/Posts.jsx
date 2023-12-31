import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
// import Pagination from "./Pagination";
import Pagination from "react-js-pagination";

import Post from "./Post";
import classes from "./Posts.module.css";

const Posts = () => {
  const resData = useLoaderData();

  const posts = resData.posts;

  const [page, setPage] = useState(1);

  const pageChangeHandler = (page) => {
    setPage(page);
    console.log(page);
  };

  // const reversedPosts = posts.slice().reverse();

  // const pageChangeHandler = (anotherPage) => {};

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
      {/* <PagiNation onPageChange={pageChangeHandler} /> */}
      {/* <PagiNation /> */}
      <Pagination
        activePage={page}
        itemsCountPerPage={10}
        totalItemsCount={20}
        pageRangeDisplayed={5}
        prevPageText={"<"}
        nextPageText={">"}
        onChange={pageChangeHandler}
        innerClass={classes.pagination}
        // itemClass={classes.paginationItem}
        // activeClass={classes.activeItem}
      />
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
