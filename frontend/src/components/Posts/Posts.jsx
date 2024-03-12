import { useEffect, useState } from "react";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
import Pagination from "./PagiNation";

import Post from "./Post";
import classes from "./Posts.module.css";

const Posts = () => {
  const loginConfirmResData = useLoaderData();
  const navigate = useNavigate();
  const token = Cookies.get("accessToken");

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firstPageGroup, setFirstPageGroup] = useState(1);
  const [lastPageGroup, setLastPageGroup] = useState(1);
  // const [loaderData, setLoaderData] = useState(
  //   `${classes.add} ${classes.opacity}`
  // );
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const onPageChange = (pageNum) => {
    navigate(`/posts?page=${pageNum}`);
    console.log(pageNum);
    setPage(pageNum);
  };

  useEffect(() => {
    paginationFetchData(page);
  }, [page]);

  console.log(token);
  console.log(isLoggedIn);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  // useEffect(() => {
  //   postAddButtonHandler();
  // }, []);

  // const postAddButtonHandler = () => {
  //   if (loginConfirmResData.userData) {
  //     setPostAddButtonClass("classes.add");
  //   } else {
  //     setPostAddButtonClass(`${classes.add} ${classes.opacity}`);
  //   }
  // };

  const postAddButtonClass = isLoggedIn
    ? `${classes.add}`
    : `${classes.add} ${classes.opacity}`;

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
      {postAddButtonClass ? (
        <Link to="create-post" className={classes.add}>
          <p>게시글 추가</p>
        </Link>
      ) : (
        <Link to="create-post" className={`${classes.add} ${classes.opacity}`}>
          <p>게시글 추가</p>
        </Link>
      )}
      {/* <Link to="create-post" className={postAddButtonClass}>
        <p>게시글 추가</p>
      </Link> */}
    </>
  );
};

export default Posts;
