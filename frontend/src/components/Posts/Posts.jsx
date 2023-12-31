import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import Pagination from "./PagiNation";
// import Pagination from "./Pagination";

import Post from "./Post";
import classes from "./Posts.module.css";

const Posts = () => {
  const navigate = useNavigate();
  // const posts = resData.posts;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch(`http://localhost:3000/posts?page=${page}`);
  //     console.log(response);
  //     const resData = await response.json();
  //     setPosts(resData.posts);
  //     setTotalPages(resData.totalPages);
  //     setFirstPageGroup(resData.firstPageGroup);
  //     setLastPageGroup(resData.lastPageGroup);
  //   };
  //   fetchData();
  // }, [page]);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firstPageGroup, setFirstPageGroup] = useState(1);
  const [lastPageGroup, setLastPageGroup] = useState(1);

  const fetchData = async (pageNumber) => {
    const response = await fetch(
      `http://localhost:3000/posts?page=${pageNumber}`
    );
    console.log(response);
    const resData = await response.json();
    return resData;
  };

  const paginationFetchData = async (pageNumber) => {
    const resData = await fetchData(pageNumber);
    setPosts(resData.posts);
    setTotalPages(resData.totalPages);
    setFirstPageGroup(resData.firstPageGroup);
    setLastPageGroup(resData.lastPageGroup);
  };

  useEffect(() => {
    paginationFetchData(page);
  }, [page]);

  const onPageChange = (pageNum) => {
    navigate(`/posts?page=${pageNum}`);
    console.log(pageNum);
    setPage(pageNum);
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
      <Pagination
        page={page}
        totalPages={totalPages}
        firstPageGroup={firstPageGroup}
        lastPageGroup={lastPageGroup}
        onPageChange={onPageChange}
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
