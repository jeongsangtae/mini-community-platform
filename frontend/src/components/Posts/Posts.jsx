import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import Pagination from "./PagiNation";

import Post from "./Post";
import AuthContext from "../../store/auth-context";
import classes from "./Posts.module.css";

const Posts = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [firstPageGroup, setFirstPageGroup] = useState(1);
  const [lastPageGroup, setLastPageGroup] = useState(1);
  const [loggedIn, setLoggedIn] = useState(false);

  const fetchData = async (pageNumber) => {
    const response = await fetch(
      `http://localhost:3000/posts?page=${pageNumber}`
    );
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

  useEffect(() => {
    console.log(authCtx.isLoggedIn);
    setLoggedIn(authCtx.isLoggedIn);
  }, [authCtx]);

  const postAddButtonClass = loggedIn
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
      <Link to="create-post" className={postAddButtonClass}>
        <p>게시글 추가</p>
      </Link>
    </>
  );
};

export default Posts;
