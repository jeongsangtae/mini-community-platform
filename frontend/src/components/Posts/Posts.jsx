import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import Post from "./Post";
import Pagination from "./PagiNation";
import LoadingIndicator from "../UI/LoadingIndicator";
// import { PostsSkeleton } from "../UI/SkeletonUI";
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (pageNumber) => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/posts?page=${pageNumber}`
        );
        const resData = await response.json();
        return resData;
      } finally {
        setIsLoading(false);
      }
    }, 2000);
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

  const postAddButtonClass = authCtx.isLoggedIn
    ? `${classes.add}`
    : `${classes.add} ${classes.opacity}`;

  // const postHeadingSkeleton = authCtx.isLoggedIn
  //   ? `${classes.heading}`
  //   : `${classes["heading-skeleton"]}`;

  return (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
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
      )}
    </>
  );
};

export default Posts;
